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
      .then((res) => User.transaction((trx) => user.transacting(trx).save()
            .then(() => user.transacting(trx).activate().save())
            .then(() => {
              account.userId = user.id;
              account.collectiveId = res.id;
              return account.transacting(trx).save()
              .then(() => user);
            })));
  },

  awsIntegration(test, timeout = 50000) {
    /**
     * We use a function here instead of => so that we can modify the timeout for this test.
     * Its integration with AWS means that this test takes an extremely variable amount of time
     * and if it keeps failing without you being able to figure out why, try to lengthen
     * the timeout or just ignore it if you can verify through a smoke test
     * that files are being uploaded to your testing S3 and that disputes render
     * and upload and download properly.
     *
     * Preferred timeout: 50000
     *
     * If you lengthen the timeout for your personal usage, please reset the length
     * to the preferred value above.
     */
    return function (...args) { // eslint-disable-line
      this.timeout(timeout);
      return test.call(...args);
    };
  },
};
