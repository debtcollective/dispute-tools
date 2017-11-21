/* globals Class, Krypton, Attachment, DisputeTool, DisputeStatus, DisputeRenderer, UserMailer
 Account */
/* eslint arrow-body-style: 0 */

const _ = require('lodash');
const gm = require('gm').subClass({ imageMagick: process.env.GM === 'true' || false });
const Promise = require('bluebird');

const DisputeAttachment = Class({}, 'DisputeAttachment').inherits(Attachment)({
  init(config) {
    Krypton.Model.prototype.init.call(this, config);

    this.fileMeta = this.fileMeta || {};

    this.hasAttachment({
      name: 'file',
      versions: {
        thumb(readStream) {
          return gm(readStream)
            .resize(40, 40)
            .stream();
        },
      },
    });
  },
});


const Dispute = Class('Dispute').inherits(Krypton.Model)({
  tableName: 'Disputes',
  validations: {
    userId: ['required'],
    disputeToolId: ['required'],
  },
  attributes: [
    'id',
    'readableId',
    'userId',
    'disputeToolId',
    'data',
    'deleted',
    'createdAt',
    'updatedAt',
  ],

  search(qs) {
    // If we're passed a human readable id just search by that and ignore everything else
    if (qs.filters && qs.filters.readable_id) {
      return this.query()
        .where(qs.filters)
        .include('[user.account, statuses]')
        .then(records => records.map(r => r.id));
    }

    const query = this.query()
      .where(Object.assign(
        { deleted: false },
        qs.filters && qs.filters.dispute_tool_id ? qs.filters : {}))
      .include('[user.account, statuses]');

    const results = [];

    return query.then((records) => {
      records.forEach((record) => {
        let nameFound = false;
        let statusFound = false;

        if (qs.name && record.user.account.fullname.toLowerCase()
          .search(qs.name.toLowerCase()) !== -1) {
          nameFound = true;
        }

        if (qs.status && record.statuses.length > 0 && record.statuses[0].status === qs.status) {
          statusFound = true;
        }

        if (!qs.name) {
          nameFound = true;
        }

        if (!qs.status) {
          statusFound = true;
        }

        if (nameFound && statusFound) {
          results.push(record);
        }
      });
    })
      .then(() => results.map((item) => item.id));
  },

  prototype: {
    data: null,
    deleted: false,

    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.data = this.data || {};

      return this;
    },

    // Krypton's default _getAttributes will replace any undefined
    // attributes with null, causing our default valued columns
    // to get null inserted into them (thereby telling Postgres to
    // not use the default...) We can override that to prevent it for
    // any given property (in this case, readableId)

    // @Override
    _getAttributes() {
      const model = this;

      const values = _.clone(model);

      const sanitizedData = {};

      model.constructor.attributes.forEach((attribute) => {
        // We skip readableId so that Krypton doesn't try to insert null into the database
        if (_.isUndefined(values[attribute]) && attribute !== 'readableId') {
          sanitizedData[attribute] = null;
        } else {
          sanitizedData[attribute] = values[attribute];
        }
      });

      return sanitizedData;
    },

    setOption(option) {
      this.data.option = option;

      return this;
    },

    setSignature(signature) {
      const dispute = this;

      return new Promise((resolve, reject) => {
        if (!signature) {
          throw new Error('The signature is required');
        }

        dispute.data.signature = signature;

        dispute.save()
          .then(resolve)
          .catch(reject);
      });
    },

    markAsCompleted(pendingSubmission) {
      const dispute = this;

      return new Promise((resolve, reject) => {
        const disputeStatus = new DisputeStatus({
          status: 'Completed',
          disputeId: dispute.id,
          pendingSubmission,
        });

        return DisputeTool.query()
          .where({ id: dispute.disputeToolId })
          .then(([tool]) => {
            return DisputeTool.transaction((trx) => {
              return dispute.transacting(trx).save()
                .then(() => {
                  tool.completed++;
                  return tool.transacting(trx).save();
                })
                .then(() => {
                  return disputeStatus.transacting(trx).save();
                });
            });
          })
          .then(resolve)
          .catch(reject);
      })
      .then(() => {
        const renderer = new DisputeRenderer({
          disputeId: dispute.id,
        });

        function fail(msg) {
          return err => {
            console.log(msg, err);
            throw err;
          };
        }

        return renderer.save()
          .catch(fail('SAVING'))
          .then(() => {
            return renderer.render(dispute)
              .catch(fail('RENDERING'))
              .then(() => {
                return DisputeRenderer.query()
                  .where({ id: renderer.id })
                  .include('attachments')
                  .then(([_disputeRenderer]) => {
                    return renderer.buildZip(_disputeRenderer).catch(fail('BUILDING ZIP'));
                  });
              });
          })
          .then(() => {
            return renderer;
          });
      });
    },

    setForm({ formName, fieldValues, _isDirty }) {
      if (!formName) {
        throw new Error('The formName is required');
      }

      if (!_.isObjectLike(fieldValues)) {
        throw new Error('The form fieldValues are invalid');
      }

      if (_isDirty) {
        this.data._forms = {};
        this.data._forms[formName] = fieldValues;
      } else {
        delete this.data._forms;
        this.data.forms = {};
        this.data.forms[formName] = fieldValues;
      }

      return this;
    },

    setDisputeProcess({ process, processCity }) {
      if (!process) {
        throw new Error('The process type is required');
      }

      this.data.disputeProcess = process;

      if (processCity) {
        this.data.disputeProcessCity = processCity;
      }

      return this;
    },

    setConfirmFollowUp() {
      this.data.disputeConfirmFollowUp = true;
      return this;
    },

    addAttachment(name, filePath) {
      const dispute = this;

      this.data.attachments = this.data.attachments || [];

      const da = new DisputeAttachment({
        type: 'Dispute',
        foreignKey: this.id,
      });

      return da.save().then(() => {
        return da.attach('file', filePath);
      })
      .then(() => {
        return da.save();
      })
      .then(() => {
        const attachment = {
          id: da.id,
          name,
          path: da.file.url('original'),
        };

        if (da.file.exists('thumb')) {
          attachment.thumb = da.file.url('thumb');
        }

        dispute.data.attachments.push(attachment);

        return dispute.save();
      });
    },

    removeAttachment(id) {
      const dispute = this;

      if (!dispute.attachments) {
        throw new Error('Dispute doesn\'t have any attachments');
      }

      const attachments = dispute.attachments
        .filter((attachment) => attachment.id === id);

      if (attachments.length === 0) {
        throw new Error('Attachment not found');
      }

      return attachments[0].destroy()
        .then(() => {
          const dataAttachment = dispute.data.attachments
            .filter((attachment) => attachment.id === id)[0];

          const index = dispute.data.attachments.indexOf(dataAttachment);

          dispute.data.attachments.splice(index, 1);

          return dispute.save();
        });
    },

    destroy() {
      this.deleted = true;

      return this.save();
    },
  },
});

module.exports = Dispute;
