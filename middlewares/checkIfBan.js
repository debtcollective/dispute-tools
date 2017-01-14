/* global CONFIG */
module.exports = (req, res, next) => {
  if (req.ban) {
    req.flash('warning', 'This account is currently suspended. <a href="/contact">Contact us</a> if you think this is a mistake.');
    res.redirect(CONFIG.router.helpers.login.url());
  } else {
    next();
  }
};
