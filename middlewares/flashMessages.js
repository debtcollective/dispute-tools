const qs = require('query-string');

module.exports = (req, res, next) => {
  if (req.query.flash) {
    res.locals.flash = JSON.parse(req.query.flash);
  }

  req.flash = (key, value) => {
    if (!res.locals.flash) res.locals.flash = {};

    res.locals.flash[key] = value;
  };

  const redirect = res.redirect;
  res.redirect = function redirectWithFlash(location, ...args) {
    if (res.locals.flash) {
      const [loc, query = ''] = location.split('?');
      location = `${loc}?${qs.stringify({
        ...qs.parse(query),
        flash: JSON.stringify(res.locals.flash),
      })}`;
      redirect.call(this, location, ...args);
    } else {
      redirect.call(this, location, ...args);
    }
  };
  next();
};
