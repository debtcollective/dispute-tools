/* globals CONFIG, User, Dispute, DisputeTool, Post */
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

    return user.save().then(() => user);
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
