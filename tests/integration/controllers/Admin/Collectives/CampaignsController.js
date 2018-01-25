/* globals Post, Dispute, Account, Collective, User, Campaign, CONFIG */
const sa = require('superagent');
const { expect } = require('chai');
const path = require('path');
const uuid = require('uuid');
const _ = require('lodash');

const { createUser } = require(path.join(process.cwd(), 'tests', 'utils', 'helpers'));
const { signInAs, getCSRF } = require(path.join(process.cwd(), 'tests', 'utils', 'csrf'));
const truncate = require(path.join(process.cwd(), 'tests', 'utils', 'truncate'));

const url = CONFIG.env().siteURL;
const urls = CONFIG.router.helpers;

describe('Admin/Collectives/CampaignsController', () => {
  let agent;
  let _csrf;

  beforeEach(() => {
    agent = sa.agent();

    return createUser({ role: 'Admin' })
      .then(admin => signInAs(admin, agent))
      .then(csrf => {
        _csrf = csrf;
      });
  });

  after(() => truncate(User, Campaign));

  describe('agnostic campaign', () => {
    const campaignTitle = `An agnostic campaign ${uuid.v4()}`;
    const accUrls = urls.Admin.Collectives.Campaigns;
    let newCampaigns;

    beforeEach(() =>
      // request new agnostic campaign
      agent.post(`${url}${accUrls.create.url(Collective.invisibleId)}`)
        .send({
          _csrf,
          collectiveId: Collective.invisibleId,
          title: campaignTitle,
        })
        .then(() => Campaign.query().where('title', campaignTitle))
        .then((campaigns) => {
          newCampaigns = campaigns;
        })
    );

    const refreshCampaignData = function refreshCampaignData() {
      return Campaign.query().where('id', newCampaigns[0].id);
    };

    const postAndUpdate = function postAndUpdate(postUrl, opts = {}) {
      _.defaults(opts, { _csrf });
      return agent.post(postUrl).send(opts)
      .then((result) => {
        _csrf = getCSRF(result);
        expect(result.status).to.equal(200);
      })
      .then(() => refreshCampaignData());
    };

    it('was created', () => expect(newCampaigns.length).to.equal(1));

    it('can be updated', () => {
      const newTitle = 'New Title';
      const updateUrl = `${url}${accUrls.update.url(Collective.invisibleId, newCampaigns[0].id)}`;
      return agent.put(updateUrl)
        .send({ title: newTitle, _csrf })
        .then((result) => expect(result.status).to.equal(200))
        .then(() => refreshCampaignData())
        .then(([editedCampaign]) => expect(editedCampaign.title).to.equal(newTitle));
    });

    it('can be (de)activated', () => {
      // campaigns are created active, so deactivate first
      const deUrl = `${url}${accUrls.deactivate.url(Collective.invisibleId, newCampaigns[0].id)}`;
      return postAndUpdate(deUrl)
        .then(([deactivatedCampaign]) => expect(deactivatedCampaign.active).to.be.false)
        // now activate it again
        .then(() => {
          const actUrl = `${accUrls.activate.url(Collective.invisibleId, newCampaigns[0].id)}`;
          return postAndUpdate(`${url}${actUrl}`);
        })
        .then(([activatedCampaign]) => expect(activatedCampaign.active).to.be.true);
    });
  });
});
