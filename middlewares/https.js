module.exports = (req, res, next) => {
  const env = process.env.NODE_ENV || 'development';

  if (env !== 'production' || req.secure) {
    return next();
  }

  res.redirect(`https://${req.headers.host}${req.url}`);
};
