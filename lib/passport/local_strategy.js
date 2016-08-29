/* globals User */

const passport = require('passport');
const bcrypt = require('bcrypt-node');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((req, id, done) => {
  User.query()
    .include('account')
    .where('id', id)
    .then((result) => {
      if (result.length !== 1) {
        return done(new Error('Passport: Can\'t deserialize user, invalid user.id'));
      }

      return done(null, result[0]);
    });
});


passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, (request, email, password, done) => {
  User.query()
    .where('email', email)
    .then((result) => {
      if (result.length === 0) {
        return done(new Error('User not found'));
      }

      const user = result[0];

      if (user.activationToken) {
        return done(new Error('User hasn\'t been activated'));
      }

      bcrypt.compare(password, user.encryptedPassword, (err, valid) => {
        if (err) {
          return done(err);
        }

        if (!valid) {
          return done(new Error('Wrong password'));
        }

        return done(null, user);
      });
    });
}));

module.exports = passport;
