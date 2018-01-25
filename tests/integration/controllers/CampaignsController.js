/* globals CONFIG, Collective, Campaign, Post */
const sa = require('superagent');
const expect = require('chai').expect;
const { createCampaign, createUser } = require('../../utils/helpers');
const { signInAs } = require('../../utils/csrf');

const url = CONFIG.env().siteURL;
const urls = CONFIG.router.helpers;

describe('CampaignsController', () => {
  let agent;

  beforeEach(() => {
    agent = sa.agent();
  });

  describe('agnostic campaigns', () => {
    let campaignId;

    before(() =>
      createCampaign({ collectiveId: Collective.invisibleId })
      .then((campaign) => {
        campaignId = campaign.id;
      })
    );

    it('should be viewable one-by-one', () =>
       agent.get(`${url}${urls.Campaigns.show.url(campaignId)}`)
        .set('Accept', 'text/html')
        .then(res => expect(res.status).to.equal(200))
    );

    it('should display an index of all of them', () =>
      agent.get(`${url}${urls.Campaigns.url()}`)
        .then(res => expect(res.text).to.have.string('This is a list of all the campaigns!!!'))
    );

    describe('Users', () => {
      let user;
      let _csrf;

      beforeEach(() =>
        createUser({ role: 'User' })
          .then((newUser) => {
            user = newUser;
          })
          .then(() => signInAs(user, agent))
          .then((csrf) => {
            _csrf = csrf;
          })
          .then(() =>
            agent.post(`${url}${urls.Campaigns.join.url(campaignId)}`)
              .send({ _csrf })
              .then(res => expect(res.status).to.equal(200))
      ));

      it('should be able to join an agnostic campaign', () =>
        Campaign.knex().table('UsersCampaigns')
          .where('campaign_id', campaignId).andWhere('user_id', user.id)
          .then(res => expect(res.length).to.equal(1))
      );

      it('should be able to participate in an agnostic campaign', () =>
        agent.post(`${url}${urls.CreatePost.url(campaignId)}`)
          .send({ _csrf, type: 'Text' })
          .then(res => expect(res.status).to.equal(200))
          .then(() => Post.query().where('user_id', user.id).andWhere('campaign_id', campaignId))
          .then(posts => expect(posts.length).to.equal(1))
      );
    });
  });
});
