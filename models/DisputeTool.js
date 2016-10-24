/* globals Class, Krypton, Dispute, DisputeStatus */

const path = require('path');

const DisputeTool = Class('DisputeTool').inherits(Krypton.Model)({
  tableName: 'DisputeTools',
  attributes: ['id', 'name', 'about', 'completed', 'createdAt', 'updatedAt'],
  prototype: {
    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      const dataFile = path.join(process.cwd(), '/lib/data/dispute-tools/', `${this.id}.js`);

      delete require.cache[require.resolve(dataFile)];

      this.data = require(dataFile);
    },
    createDispute(config) {
      const dispute = new Dispute({
        disputeToolId: this.id,
        userId: config.user.id,
      });

      const status = new DisputeStatus({
        status: 'Incomplete',
      });

      dispute.setOption(config.option);

      return Dispute.transaction((trx) => {
        return dispute.transacting(trx).save()
          .then(() => {
            status.disputeId = dispute.id;

            return status.transacting(trx).save()
              .then(() => {
                return dispute.id;
              });
          });
      });
    },
  },
});

module.exports = DisputeTool;
