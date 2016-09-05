/* globals Class, Krypton, DisputeAttachment */

const Dispute = Class('Dispute').inherits(Krypton.Model)({
  tableName: 'Disputes',
  validations: {
    userId: ['required'],
    disputeToolId: ['required'],
  },
  attributes: ['id', 'userId', 'disputeToolId', 'data', 'createdAt', 'updatedAt'],

  prototype: {
    data: null,

    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.data = this.data || {};

      return this;
    },

    setOption(option) {
      this.data['option'] = option;

      return this;
    },

    setSignature(signature) {
      this.data['signature'] = signature;

      return this;
    },

    setForm(name, data) {
      this.data[name] = data;

      return this;
    },

    setDisputeProcess(process) {
      this.data['disputeProcess'] = process;

      return this;
    },

    addAttachment(name, filePath) {
      const dispute = this;

      this.data['attachments'] = this.data['attachments'] || [];

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
  },
});

module.exports = Dispute;
