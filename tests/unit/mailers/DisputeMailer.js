/* globals UserMailer, BaseMailer, Class, CONFIG, User, Account */

const expect = require('chai').expect;
const DisputeMailer = require('../../../mailers/DisputeMailer');
const { createUser } = require('../../utils');

const { mailers: { transport } } = CONFIG;

describe('DisputeMailer', () => {
  let admin;

  before(async () => {
    admin = await createUser({ admin: true });
  });

  it('Should execute a sendToAdmins method', function sendToAdmins() {
    this.timeout(5000);

    DisputeMailer.transport(transport);

    admin.account = {
      name: 'Test Name',
    };

    return DisputeMailer.sendToAdmins({
      user: admin,
      dispute: {
        id: 1,
        userId: admin.id,
        disputeToolId: '11111111-1111-1111-1111-111111111111',
        deactivated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        disputeTool: {
          name: 'Test Tool',
        },
      }, // mock the dispute data here
      disputeStatus: {
        id: 1,
        disputeId: 1,
        status: 'Update',
        comment: 'Hello',
        notify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, // mock the dispute status data here,
    }).then(response => {
      const acceptedOrRejected = response.accepted[0] || response.rejected[0];

      expect(acceptedOrRejected).to.be.equal(CONFIG.mailers.disputesBCCAddresses[0]);
    });
    // .then(() => new Promise(ok => setTimeout(ok, 1000)));
  });
});
