const sso = require('./sso');

module.exports = async (req, res, next) => {
  if (!req.user) {
    if (req.cookies['dispute-tool']) {
      return sso.extractCookie(req, res, next);
    }

    if (req.query.sso && req.query.sig) {
      const payload = sso.extractPayload(req.query);
      req.user = await sso.handlePayload(payload);

      return sso.createCookie(req, res, next);
    }

    return res.format({
      html() {
        return res.redirect(sso.buildRedirect(req));
      },
      json() {
        return res.status(403).end();
      },
    });
  }
};
