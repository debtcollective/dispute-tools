const User = require('../models/User');
const discourse = require('../lib/discourse');

exports.getSsoUserEnsuringCreated = async externalId => {
  let [user] = await User.query()
    .where('external_id', externalId)
    .limit(1);

  if (!user) {
    user = new User({
      externalId,
    });
    await user.save();
  }

  user.setInfo(await discourse.admin.users.getById(externalId));
  return user;
};
