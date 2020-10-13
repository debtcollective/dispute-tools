const SSO = require('$services/sso');

module.exports = async function locals(req, res, next) {
  req.user = await SSO.currentUser(req.cookies);

  return next();
};
