/* global CONFIG */
module.exports = (req, res, next) => {
  if (req.ban) {
    req.flash('error', 'This account is currently suspended. Contact us if you think this is a mistake.');
    res.redirect(CONFIG.router.helpers.login.url());
  } else {
    next();
  }
};
