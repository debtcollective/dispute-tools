/* globals CONFIG, User, Account, Dispute, DisputeTool, Post */
const uuid = require('uuid');
const _ = require('lodash');

// create objects helper
module.exports = {
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

    return user.save().then(() => {
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
};
