/* globals CONFIG, User, Account, Dispute, DisputeTool, Post */
const _ = require('lodash');

const ids = {
  _external: 0,
  get nextExternal() {
    return ++ids._external;
  },
};

// create objects helper
module.exports = {
  createUser(params = {}) {
    _.defaults(params, {
      external_id: ids.nextExternal,
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
