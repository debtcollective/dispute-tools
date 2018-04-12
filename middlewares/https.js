module.exports = (req, res, next) => {
  const env = process.env.NODE_ENV || 'development';

  // /health-check is used by ECS and ALB to check if the container is healthy
  // it get's confused by the redirecction, so we are skipping that for this route
  if (env !== 'production' || req.secure || req.url === '/health-check') {
    return next();
  }

  res.redirect(`https://${req.headers.host}${req.url}`);
};
