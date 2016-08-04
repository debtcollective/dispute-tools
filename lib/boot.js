var path = require('path');

// Custom Errors
global.NotFoundError = function NotFoundError(message) {
  this.name = 'NotFoundError';
  this.message = message || 'Not Found';
}

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

// Load LithiumEngine
if (CONFIG[CONFIG.environment].enableLithium) {
  require(path.join(process.cwd(), 'lib', 'LithiumEngine.js'));
}

// Load RouteMapper
CONFIG.router = require(path.join(process.cwd(), 'config', 'RouteMappings.js'));
CONFIG.router.helpers = CONFIG.router.mappings;

// Comment the following 2 lines to disable database access
var knex = require('knex')(CONFIG.database[CONFIG.environment]);
Krypton.Model.knex(knex); // Bind a knex instance to all Krypton Models
