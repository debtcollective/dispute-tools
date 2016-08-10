/* globals NotFoundError, CONFIG, Krypton */

const path = require('path');
const uuid = require('uuid');
const Knex = require('knex');

// Load LithiumEngine
if (CONFIG.env().enableLithium) {
  require(path.join(process.cwd(), 'lib', 'LithiumEngine.js'));
}

// Custom Errors
// Won't use arrow function here because its a constructor.
global.NotFoundError = function NotFoundError(message) {
  this.name = 'NotFoundError';
  this.message = message || 'Not Found';
};

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

// Load RouteMapper
CONFIG.router = require(path.join(process.cwd(), 'config', 'RouteMappings.js'));
CONFIG.router.helpers = CONFIG.router.mappings;

// Comment the following 2 lines to disable database access
const knex = Knex(CONFIG.database[CONFIG.environment]);
Krypton.Model.knex(knex); // Bind a knex instance to all Krypton Models

// Add uuid to all Krypton.Model ids
const oldKryptonInit = Krypton.Model.prototype.init;

// Won't use arrow function here because its a constructor.
Krypton.Model.prototype.init = function init(config) {
  oldKryptonInit.call(this, config);

  this.on('beforeCreate', (done) => {
    try {
      this.id = uuid.v4();
      return done();
    } catch (err) {
      return done(err);
    }
  });

  return this;
};
