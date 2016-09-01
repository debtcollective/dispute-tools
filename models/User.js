/* global Krypton, Class, CONFIG, UserMailer */

const bcrypt = require('bcrypt-node');

const User = Class('User').inherits(Krypton.Model)({
  tableName: 'Users',
  validations: {
    email: [
      'required',
      'email',
      'maxLength:255',
      {
        rule(val) {
          const target = this.target;

          const query = User.query()
            .where({
              email: val,
            });

          if (target.id) {
            query.andWhere('id', '!=', target.id);
          }

          return query.then((result) => {
            if (result.length > 0) {
              throw new Error('The User\'s email already exists.');
            }
          });
        },
        message: 'The User\'s email already exists.',
      },
    ],
    password: ['minLength:8'],
    role: [
      'required',
      {
        rule(val) {
          if (User.roles.indexOf(val) === -1) {
            throw new Error('The User\'s role is invalid.');
          }
        },
        message: 'The User\'s role is invalid.',
      },
    ],
  },

  attributes: [
    'id',
    'email',
    'encryptedPassword',
    'activationToken',
    'resetPasswordToken',
    'role',
    'createdAt',
    'updatedAt',
  ],

  roles: ['Admin', 'CollectiveManager', 'User'],

  prototype: {
    email: null,
    password: null,

    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      const model = this;

      // Start Model Hooks:

      let oldEmail = model.email;

      // If password is present hash password and set it as encryptedPassword
      model.on('beforeSave', (done) => {
        if (!model.password) {
          return done();
        }

        bcrypt.hash(model.password, bcrypt.genSaltSync(10), null, (err, hash) => {
          if (err) {
            return done(err);
          }

          model.encryptedPassword = hash;

          model.password = null;
          return done();
        });
      });

      // Updates old email when record saves
      model.on('afterSave', (done) => {
        oldEmail = model.email;
        done();
      });

      // setActivationToken helper function
      const setActivationToken = (done) => {
        bcrypt.hash(CONFIG.env().sessions.secret + Date.now(),
          bcrypt.genSaltSync(10), null, (err, hash) => {
            if (err) {
              return done(err);
            }

            model.activationToken = hash;
            return done();
          });
      };

      // Create a hash and set it as activationToken
      model.on('beforeCreate', (done) => {
        setActivationToken(done);
      });

      // sendActivation helper function
      const sendActivation = (done) => {
        UserMailer.sendActivation(model.email, {
          user: model,
          _options: {
            subject: 'Activate your account - The Debt Collective',
          },
        })
          .then(() => {
            done();
          })
          .catch(done);
      };

      // Send activation email
      model.on('afterCreate', (done) => {
        sendActivation(done);
      });

      // If email changes, set activationToken again
      model.on('beforeUpdate', (done) => {
        if (oldEmail === model.email) {
          return done();
        }

        return setActivationToken(done);
      });

      // If email changed, send activation email
      model.on('afterUpdate', (done) => {
        if (oldEmail === model.email) {
          return done();
        }

        return sendActivation(done);
      });
    },

    activate() {
      this.activationToken = null;

      return this;
    },
  },
});

module.exports = User;
