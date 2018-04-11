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
      redirect.call(this, `${location}?flash=${JSON.stringify(res.locals.flash)}`, ...args);
    } else {
      redirect.call(this, location, ...args);
    }
  };
  next();
};
