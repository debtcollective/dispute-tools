/* global Krypton, Class, CONFIG, UserMailer */

const bcrypt = require('bcrypt-node');
const uuid = require('uuid');

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
    password: [
      'minLength:8',
    ],
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

  search(qs) {
    const query = this.knex()
      .select(`Users.*`)
      .from('Users')
      .join('Accounts', 'Users.id', 'Accounts.user_id')
      .where('Users.email', 'ilike', `%${qs.search}%`)
      .orWhere('Accounts.fullname', 'ilike', `%${qs.search}%`)
      .orWhere('Accounts.zip', 'ilike', `%${qs.search}%`);

    if (qs.state && qs.state !== '') {
      query
        .andWhere('Accounts.state', '=', qs.state);
    }

    return query
      .then((results) => {
        return results.map((item) => {
          return item.id;
        });
      });
  },

  prototype: {
    email: null,
    password: null,
    _oldEmail: null,

    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      const model = this;

      // Start Model Hooks:

      this._oldEmail = model.email;

      model.on('beforeValidation', (done) => {
        if (!model.id && (!model.password || model.password.length === 0)) {
          return done(new Error('Must provide a password'));
        }

        return done();
      });

      // If password is present hash password and set it as encryptedPassword
      model.on('beforeSave', (done) => {
        if (!model.password) {
          return done();
        }

        return bcrypt.hash(model.password, bcrypt.genSaltSync(10), null, (err, hash) => {
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
        this._oldEmail = model.email;
        done();
      });

      // setActivationToken helper function
      const setActivationToken = (done) => {
        model.activationToken = uuid.v4();
        return done();
      };

      // Create a hash and set it as activationToken
      model.on('beforeCreate', (done) => {
        setActivationToken(done);
      });

      // If email changes, set activationToken again
      model.on('beforeUpdate', (done) => {
        if (model._oldEmail === model.email) {
          return done();
        }

        model._oldEmail = model.email;

        return setActivationToken(done);
      });
    },

    activate() {
      this.activationToken = null;

      return this;
    },

    sendActivation() {
      const model = this;

      return UserMailer.sendActivation(this.email, {
        user: model,
        _options: {
          subject: 'Activate your account - The Debt Collective',
        },
      });
    },
  },
});

module.exports = User;
