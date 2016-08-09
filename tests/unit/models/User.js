'use strict';

let path = require('path');
let _ = require('lodash');
let truncate = require(path.join(process.cwd(), 'tests', 'utils', 'truncate'));

global.UserMailer = {
  sendActivation : function() {
    return Promise.resolve();
  }
}



describe('User', () => {
  describe('Validations', () => {
    beforeEach(() => {
      return truncate(User);
    });

    after(() => {
      return truncate(User);
    });

    describe('email', () => {
      it('Should fail if the email already exists', () => {
        return Promise.resolve()
          .then(() => {
            return new User({
              email: 'user@example.com',
              password: '12345678',
              role: 'User',
            }).save();
          })
          .then(() => {
            return new User({
              email: 'user@example.com',
              password: '12345678',
              role: 'User',
            }).save();
          })
          .then(() => {
            expect.fail('should have rejected');
          })
          .catch((err) => {
            expect(err.message).to.be.equal('1 invalid values');
            expect(err.errors.email.message).to.be.equal('The User\'s email already exists.')
          });
      });

      it('Should fail if the email is undefined', () => {
        return Promise.resolve()
          .then(() => {
            return new User({
              password : '12345678',
              role : 'User'
            }).save();
          })
          .then(() => {
            expect.fail('should have rejected');
          })
          .catch((err) => {
            expect(err.message).to.be.equal('1 invalid values');
            expect(err.errors.email.message).to.be.equal('The email is required')
          });
      });

      it('Should fail if the email is invalid', () => {
        return Promise.resolve()
          .then(() => {
            return new User({
              email: '1',
              password: '12345678',
              role: 'User',
            }).save();
          })
          .then(() => {
            expect.fail('should have rejected');
          })
          .catch((err) => {
            expect(err.message).to.be.equal('1 invalid values');
            expect(err.errors.email.message).to.be.equal('The email must be a valid email address')
          });
      });

      it('Should fail if the email is longer than 255 characters', () => {
        return Promise.resolve()
          .then(() => {
            return new User({
              email: 'user@' + _.repeat('a', 255) + '.com',
              password: '12345678',
              role: 'User',
            }).save();
          })
          .then(() => {
            expect.fail('should have rejected');
          })
          .catch((err) => {
            expect(err.message).to.be.equal('1 invalid values');
            expect(err.errors.email.message).to.be.equal('The email must not exceed 255 characters long');
          });
      });
    });

    describe('password', () => {

      it('Should fail if the password is shorter than 8 characters', () => {
        return Promise.resolve()
          .then(() => {
            return new User({
              email: 'user@example.com',
              password: '1234567',
              role: 'User',
            }).save();
          })
          .then(() => {
            expect.fail('should have rejected');
          })
          .catch((err) => {
            expect(err.message).to.be.equal('1 invalid values');
            expect(err.errors.password.message).to.be.equal('The password must be at least 8 characters long');
          });
      });

    });

    describe('role', () => {

      it('Should fail if the role is invalid', () => {
        return Promise.resolve()
          .then(() => {
            return new User({
              email: 'user@example.com',
              password: '12345678',
              role: 'Master',
            }).save();
          })
          .then(() => {
            expect.fail('should have rejected');
          })
          .catch((err) => {
            expect(err.message).to.be.equal('1 invalid values');
            expect(err.errors.role.message).to.be.equal('The User\'s role is invalid.');
          });
      });

    });
  });

  describe('Methods', () => {

    describe('activate()', () => {

      it('Should set this.activationToken to null',() => {
        let user = new User({
          email : 'user@example.com',
          password : '12345678',
          role : 'User',
          activationToken : _.repeat('a', 128)
        });

        expect(user.activationToken).to.equal(_.repeat('a', 128));

        user.activate();

        expect(user.activationToken).to.equal(null);
      });
    });
  });
});
