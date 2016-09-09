/* globals CONFIG, Collective, User, Account */
const uuid = require('uuid');

module.exports = {
  createUser(role) {
    if (!role) {
      throw new Error('Role is not defined');
    }

    const user = new User({
      role,
      email: `user-${uuid.v4()}@example.com`,
      password: '12345678',
    });

    const account = new Account({
      fullname: 'Example Account Name',
      bio: '',
      state: 'Texas',
      zip: '73301',
    });

    return Collective.first()
      .then((res) => {
        return User.transaction((trx) => {
          return user.transacting(trx).save()
            .then(() => {
              return user.transacting(trx).activate().save();
            })
            .then(() => {
              account.userId = user.id;
              account.collectiveId = res.id;
              return account.transacting(trx).save()
              .then(() => {
                return user;
              });
            });
        });
      });
  },

};
