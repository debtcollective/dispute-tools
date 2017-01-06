/* globals UserMailer, BaseMailer, Class, CONFIG, User, Account */

const expect = require('chai').expect;
const path = require('path');

const DisputeMailer = require(path.join(process.cwd(), 'mailers', 'DisputeMailer'));
const truncate = require(path.join(process.cwd(), 'tests', 'utils', 'truncate'));
const { createUser } = require('../../utils/helpers.js');

describe('DisputeMailer', () => {
  let admin;

  before(() => {
    return createUser('Admin')
      .then((res) => {
        admin = res;
      });
  });

  after(() => {
    truncate([User, Account]);
  });

  xit('Should execute a sendToAdmins method', () => {
    DisputeMailer.transport(CONFIG.env().mailers.transport);

    admin.account = {
      name: 'Test Name',
    };

    return DisputeMailer.sendToAdmins({
      user: admin,
      dispute: {
        id: 1,
        userId: admin.id,
        disputeToolId: '11111111-1111-1111-1111-111111111111',
        deleted: false,
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
    })
    .then((response) => {
      console.log('BUG: THIS IS CALLED BUT THE TEST IS NOT BEING DONE');
      expect(response.envelope.to[0]).to.be.equal(CONFIG.env().mailers.disputesBCCAddresses[0]);
    });
  });
});
