const sso = require('../services/sso');

module.exports = async (req, res, next) => {
  if (req.query.sig && req.query.sso) {
    const payload = sso.extractPayload(req.query);
    req.user = await sso.handlePayload(payload);

    sso.createCookie(req, res, next);
  } else {
    next();
  }
};
