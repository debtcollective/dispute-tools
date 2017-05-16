const airbrake = require('airbrake');
if (CONFIG.environment === 'production') {
  const airbrakeClient = airbrake.createClient(
    CONFIG[CONFIG.environment].airbrake.projectId,
    CONFIG[CONFIG.environment].airbrake.projectKey
  );
  module.exports = airbrakeClient.expressHandler();
} else {
  module.exports = (req, res, next) => next();
}
