/* globals Class, Krypton, Attachment, DisputeTool, DisputeStatus, DisputeRenderer, UserMailer */
/* eslint arrow-body-style: 0 */

const _ = require('lodash');
const gm = require('gm').subClass({ imageMagick: true });;

const Dispute = Class('Dispute').inherits(Krypton.Model)({
  tableName: 'Disputes',
  validations: {
    userId: ['required'],
    disputeToolId: ['required'],
  },
  attributes: ['id', 'userId', 'disputeToolId', 'data', 'deleted', 'createdAt', 'updatedAt'],

  prototype: {
    data: null,
    deleted: false,

    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.data = this.data || {};

      return this;
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

        const disputeStatus = new DisputeStatus({
          status: 'Completed',
          disputeId: dispute.id,
        });

        return DisputeTool.query()
          .where('id', dispute.disputeToolId)
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

        return renderer.save()
          .then(() => {
            return renderer.render(dispute)
              .then(() => {
                return DisputeRenderer.query()
                  .where({ id: renderer.id })
                  .include('attachments')
                  .then(([_disputeRenderer]) => {
                    return renderer.buildZip(_disputeRenderer);
                  });
              });
          })
          .then(() => {
            return renderer;
          });
      });
    },

    setForm({ formName, fieldValues }) {
      this.data.forms = this.data.forms = {};

      if (!formName) {
        throw new Error('The formName is required');
      }

      if (!_.isObjectLike(fieldValues)) {
        throw new Error('The form fieldValues are invalid');
      }

      this.data.forms[formName] = fieldValues;

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
