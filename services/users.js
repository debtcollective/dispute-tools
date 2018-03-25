/* globals User */

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

  return user;
};
