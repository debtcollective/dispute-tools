const User = require('../models/User');
const discourse = require('../lib/discourse');

exports.makeUserFromExternalId = async externalId => {
  const user = new User({
    externalId,
  });
  await user.save();
  return user;
};

exports.findDiscourseUserEnsuringCreated = async externalId => {
  let [user] = await User.query()
    .where('external_id', externalId)
    .limit(1);

  if (!user) {
    user = exports.makeUserFromExternalId(externalId);
  }

  return user;
};

exports.findAllDiscourseUsersEnsuringCreated = async externalIds => {
  const users = await User.query().whereIn('external_id', externalIds);
  return Promise.all(
    externalIds.map(
      async externalId =>
        users.find(u => u.externalId === externalId.toString()) ||
        exports.makeUserFromExternalId(externalId),
    ),
  );
};

exports.mergeDiscourseUser = async discourseUser => {
  const user = exports.findDiscourseUserEnsuringCreated(
    discourseUser.externalId || discourseUser.id,
  );
  return user.setInfo(discourseUser);
};

exports.getSsoUserEnsuringCreated = async externalId => {
  const user = await exports.findDiscourseUserEnsuringCreated(externalId);
  user.setInfo(await discourse.getUser(user));
  return user;
};
