/* globals NotFoundError, CONFIG, Krypton, BaseMailer */

const path = require('path');
const uuid = require('uuid');
const Knex = require('knex');
const nodemailer = require('nodemailer');

// require('scandium-express');

// require(path.join(process.cwd(), 'lib/ACL/acl_support.js'));
require(path.join(process.cwd(), 'lib', 'BaseMailer'));
global.NotFoundError = require('./errors/NotFoundError');

// Load LithiumEngine
if (CONFIG.env().enableLithium) {
  require(path.join(process.cwd(), 'lib', 'LithiumEngine.js'));
}

// Load RouteMapper
CONFIG.router = require(path.join(process.cwd(), 'config', 'RouteMappings.js'));
CONFIG.router.helpers = CONFIG.router.mappings;

// Comment the following 2 lines to disable database access
const knex = Knex(CONFIG.database[CONFIG.environment]);
exports.knex = knex;
Krypton.Model.knex(knex); // Bind a knex instance to all Krypton Models

// Add uuid to all Krypton.Model ids
const oldKryptonInit = Krypton.Model.prototype.init;

// Won't use arrow function here because its a constructor.
Krypton.Model.prototype.init = function init(config) {
  oldKryptonInit.call(this, config);

  this.on('beforeCreate', done => {
    try {
      this.id = uuid.v4();
      return done();
    } catch (err) {
      return done(err);
    }
  });

  return this;
};

/* BaseMailer */
const transport = nodemailer.createTransport(CONFIG.env().nodemailer);

CONFIG.env().mailers.transport = transport;

BaseMailer.transport(transport);
