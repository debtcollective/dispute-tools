/* globals NotFoundError, CONFIG, Krypton */

const path = require('path');
const uuid = require('uuid');
const Knex = require('knex');
const nodemailer = require('nodemailer');

global.NotFoundError = require('./errors/NotFoundError');

// Load RouteMapper
CONFIG.router = require(path.join(process.cwd(), 'config', 'RouteMappings.js'));
CONFIG.router.helpers = CONFIG.router.mappings;

// Comment the following 2 lines to disable database access
const knex = Knex(CONFIG.database);
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

const transport = nodemailer.createTransport(CONFIG.nodemailer);

CONFIG.mailers.transport = transport;
