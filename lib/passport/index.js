/* globals User, CONFIG */
const passport = require('passport');
const DiscourseStrategy = require('./discourse');
const { NotFoundError } = require('$lib/errors');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.query()
    .where('id', id)
    .then(result => {
      if (result.length !== 1) {
        return done(new NotFoundError("Passport: Can't deserialize user, invalid user.id"));
      }

      const user = result[0];

      done(null, user);
    });
});

passport.use(new DiscourseStrategy());

module.exports = passport;
