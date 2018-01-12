/* globals CONFIG, Collective, User, Account, Dispute, DisputeTool, Campaign, Post */
const uuid = require('uuid');
const _ = require('lodash');

const url = CONFIG.env().siteURL;
const urls = CONFIG.router.helpers;

const getCSRF = function getCSRF(res) {
  return unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie'])[1]);
};

// create objects helper
module.exports = {
  getCSRF,
  createUser(params = {}) {
    _.defaults(params, {
      role: 'User',
      email: `user-${uuid.v4()}@example.com`,
      password: '12345678',
      account: {
        fullname: 'Example Account Name',
        bio: '',
        state: 'Texas',
        zip: '73301',
      },
    });

    const user = new User(params);

    const account = new Account(params.account);

    return Collective.first()
      .then(collective =>
        User.transaction(trx =>
          user
            .transacting(trx)
            .save()
            .then(() =>
              user
                .transacting(trx)
                .activate()
                .save(),
            )
            .then(() => {
              account.userId = user.id;
              return account.transacting(trx).save();
            })
            .then(() =>
              User.knex()
                .table('UsersCollectives')
                .transacting(trx)
                .insert([{ user_id: user.id, collective_id: collective.id }]),
            )
            .then(() => {
              collective.userCount++;
              return collective.transacting(trx).save();
            }),
        ),
      )
      .then(() => {
        user.account = account;
        return user;
      });
  },
  createDispute(user) {
    return DisputeTool.first().then(tool =>
      tool
        .createDispute({
          user,
          option: tool.data.options.A ? 'A' : 'none',
        })
        .then(disputeId => Dispute.query().where('id', disputeId)),
    );
  },
  createPost(user) {
    return Campaign.first().then(campaign => {
      const post = new Post({
        campaignId: campaign.id,
        type: 'Text',
        userId: user.id,
      });
      return Post.transaction(trx => post.transacting(trx).save()).then(
        () => post,
      );
    });
  },
  createEvent(user) {
    return Campaign.first().then(campaign => {
      const event = new Event({
        campaignId: campaign.id,
        userId: user.id,
        name: 'An Event',
        description: 'This is an event',
        date: new Date(),
        timespan: 'a timespan',
        locationName: 'the universe',
      });
      return Event.transaction(trx => event.transacting(trx).save());
    });
  },
  signInAs(user, agent) {
    // assumes password '12345678'; returns csrf token

    return agent
      .get(`${url}`)
      .set('Accept', 'text/html')
      .then(getResult =>
        agent
          .post(`${url}${urls.login.url()}`)
          .set('Accept', 'text/html')
          .send({
            email: user.email,
            password: '12345678',
            _csrf: getCSRF(getResult),
          }),
      )
      .then(postResult => getCSRF(postResult))
      .catch(err => {
        throw new Error(`Error while logging in: ${err.stack}`);
      });
  },
};
