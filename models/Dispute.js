/* globals Class, Krypton, DisputeAttachment, DisputeTool, DisputeStatus */

const _ = require('lodash');

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

    setDisputeProcess({ process }) {
      if (!process) {
        throw new Error('The process type is required');
      }

      this.data.disputeProcess = process;

      return this;
    },

    addAttachment(name, filePath) {
      const dispute = this;

      this.data.attachments = this.data.attachments || [];

      const da = new DisputeAttachment();

      da.disputeId = this.id;

      return da.save().then(() => {
        return da.attach('file', filePath);
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
      });
    },

    destroy() {
      this.deleted = true;

      return this.save();
    },
  },
});

module.exports = Dispute;
