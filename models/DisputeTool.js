/* globals Class, Krypton, Dispute, DisputeStatus */

const DisputeTool = Class('DisputeTool').inherits(Krypton.Model)({
  tableName: 'DisputeTools',
  attributes: ['id', 'name', 'about', 'completed', 'data', 'createdAt', 'updatedAt'],
  prototype: {
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
