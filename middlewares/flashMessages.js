module.exports = (req, res, next) => {
  req.flash = (key, value) => {
    if (!res.locals.flash) res.locals.flash = {};

    res.locals.flash[key] = value;
  };
  next();
};
