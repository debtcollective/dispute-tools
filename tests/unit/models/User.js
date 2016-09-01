/* globals User, Account, Collective */

const expect = require('chai').expect;
const Promise = require('bluebird');
const path = require('path');
const _ = require('lodash');
const uuid = require('uuid');

const truncate = require(path.join(process.cwd(), 'tests', 'utils', 'truncate'));

global.UserMailer = {
  sendActivation() {
    return Promise.resolve();
  },
};


describe('User', () => {
  let collective;

  before(() => {
    return Collective.first().then((res) => {
      collective = res;
    });
  });

  describe('Validations', () => {
    beforeEach(() => {
      truncate(User);
    });

    after(() => {
      truncate(User);
    });

    describe('email', () => {
      it('Should fail if the email already exists', () =>
        Promise.resolve()
          .then(() =>
            new User({
              email: 'user@example.com',
              password: '12345678',
              role: 'User',
            }).save()
          )
          .then(() =>
            new User({
              email: 'user@example.com',
              password: '12345678',
              role: 'User',
            }).save()
          )
          .then(() => {
            expect.fail('should have rejected');
          })
          .catch((err) => {
            expect(err.message).to.be.equal('1 invalid values');
            expect(err.errors.email.message).to.be.equal('The User\'s email already exists.');
          })
      );

      it('Should fail if the email is undefined', () =>
        Promise.resolve()
          .then(() =>
            new User({
              password: '12345678',
              role: 'User',
            }).save()
          )
          .then(() => {
            expect.fail('should have rejected');
          })
          .catch((err) => {
            expect(err.message).to.be.equal('1 invalid values');
            expect(err.errors.email.message).to.be.equal('The email is required');
          })
      );

      it('Should fail if the email is invalid', () =>
        Promise.resolve()
          .then(() =>
            new User({
              email: '1',
              password: '12345678',
              role: 'User',
            }).save()
          )
          .then(() => {
            expect.fail('should have rejected');
          })
          .catch((err) => {
            expect(err.message).to.be.equal('1 invalid values');
            expect(err.errors.email.message).to.be.equal('The email must be a valid email address');
          })
      );

      it('Should fail if the email is longer than 255 characters', () =>
        Promise.resolve()
          .then(() =>
            new User({
              email: `user@${_.repeat('a', 255)}.com`,
              password: '12345678',
              role: 'User',
            }).save()
          )
          .then(() => {
            expect.fail('should have rejected');
          })
          .catch((err) => {
            expect(err.message).to.be.equal('1 invalid values');
            expect(err.errors.email.message)
              .to.be.equal('The email must not exceed 255 characters long');
          })
      );
    });

    describe('password', () => {
      it('Should fail if the password is shorter than 8 characters', () =>
        Promise.resolve()
          .then(() =>
            new User({
              email: 'user@example.com',
              password: '1234567',
              role: 'User',
            }).save()
          )
          .then(() => {
            expect.fail('should have rejected');
          })
          .catch((err) => {
            expect(err.message).to.be.equal('1 invalid values');
            expect(err.errors.password.message)
              .to.be.equal('The password must be at least 8 characters long');
          })
      );
    });

    describe('role', () => {
      it('Should fail if the role is invalid', () =>
        Promise.resolve()
          .then(() =>
            new User({
              email: 'user@example.com',
              password: '12345678',
              role: 'Master',
            }).save()
          )
          .then(() => {
            expect.fail('should have rejected');
          })
          .catch((err) => {
            expect(err.message).to.be.equal('1 invalid values');
            expect(err.errors.role.message).to.be.equal('The User\'s role is invalid.');
          })
      );
    });
  });

  describe('Methods', () => {
    describe('activate()', () => {
      it('Should set this.activationToken to null', () => {
        const user = new User({
          email: 'user@example.com',
          password: '12345678',
          role: 'User',
          activationToken: _.repeat('a', 128),
        });

        expect(user.activationToken).to.equal(_.repeat('a', 128));

        user.activate();

        expect(user.activationToken).to.equal(null);
      });
    });
  });

  describe('Relations', () => {
    describe('account', () => {
      it('Should return a valid Account model', () => {
        const user = new User({
          email: 'user@example.com',
          password: '12345678',
          role: 'Admin',
        });

        const account = new Account({
          fullname: 'Example Account Name',
          bio: '',
          state: 'Texas',
          zip: '73301',
        });

        return User.transaction((trx) => {
          return user.transacting(trx).save()
            .then(() => {
              account.userId = user.id;
              account.collectiveId = collective.id;

              return account.transacting(trx).save();
            });
        }).then(() => {
          return User.query().include('[account.debtType]');
        })
        .then((result) => {
          expect(result[0].account).to.be.instanceof(Account);
          expect(result[0].account.debtType).to.be.instanceof(Collective);
        });
      });
    });
  });
});
