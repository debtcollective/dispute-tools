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

  it('Should execute a sendToAdmins method', () => {
    DisputeMailer.transport(CONFIG.env().mailers.transport);

    return DisputeMailer.sendToAdmins({
      dispute: {}, // mock the dispute data here
      disputeStatus: {}, // mock the dispute status data here,
    })
    .then((response) => {
      expect(response.envelope.to[0]).to.be.equal(CONFIG.env().mailers.disputesBCCAddresses[0]);
    });
  });
});
