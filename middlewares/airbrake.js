const airbrake = require('airbrake');
const airbrakeClient = airbrake.createClient(
  CONFIG[CONFIG.environment].airbrake.projectId,
  CONFIG[CONFIG.environment].airbrake.projectKey
);
module.exports = airbrakeClient.expressHandler();
