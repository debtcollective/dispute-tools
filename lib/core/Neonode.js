/* globals Class, CONFIG, logger */

const glob = require('glob');
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const path = require('path');

const cwd = process.cwd();

const Neonode = Class({}, 'Neonode')({
  prototype: {
    express: null,
    http: null,
    server: null,
    router: null,
    env: CONFIG.environment,

    controllers: {},
    models: {},

    init() {
      logger.info('Initializing Application');

      this.express = express;
      this.http = http;

      this.app = this.express();

      this.server = this.http.createServer(this.app);

      logger.info('Application Initialized');

      logger.info('Execute application._serverStart() to start the server');

      return this;
    },

    _configureApp() {
      // *************************************************************************
      //                  Setup Pug engine for Express
      // *************************************************************************
      logger.info('Setting Pug Engine for Express');
      this.app.set('view engine', 'pug');
      this.app.set('views', 'views');

      this.app.enable('trust proxy');

      // *************************************************************************
      //                            Static routes
      // *************************************************************************
      this.app.use('/', this.express.static('public'));

      // *************************************************************************
      //                            Request Logging
      // *************************************************************************
      this.app.use(morgan('combined', {
        stream: logger.stream,
      }));

      return this;
    },

    _serverStop() {
      this.server.close();
    },

    _serverStart() {
      this.server.listen(CONFIG.env().port);
    },

    loadControllers() {
      this._configureApp();

      logger.info('Loading Models');

      glob.sync('models/*.js').forEach((file) => {
        logger.info(`Loading ${file} ...`);
        require(path.join(cwd, file));
      });

      // Load Mailers
      glob.sync('mailers/*.js').forEach((file) => {
        logger.info(`Loading ${file} ...`);
        require(path.join(cwd, file));
      });

      logger.info('Loading BaseController.js');
      require('./controllers/BaseController.js');

      logger.info('Loading RestfulController.js');
      require('./controllers/RestfulController.js');

      glob.sync('controllers/**/*.js').forEach((file) => {
        logger.info(`Loading ${file} ...`);

        const fileNameArray = file.split('/');

        const controller = require(path.join(cwd, file));

        let controllerName = controller.name;

        if (fileNameArray.length > 2) {
          fileNameArray.shift(1); // remove the first item of the array (controllers)
          fileNameArray.pop(1); // remove the last item of the array (filename)

          controllerName = `${fileNameArray.join('.')}.${controller.name}`;
        }

        this.controllers[controllerName] = controller;
      });

      // *************************************************************************
      //                      External Middlewares
      // *************************************************************************
      CONFIG.middlewares.forEach((middleware) => {
        logger.info(`Loading ${middleware.name} middleware: ${middleware.path} ...`);

        const middlewareFile = require(path.join(cwd, middleware.path));

        this.app.use(middlewareFile);
      });

      return this;
    },
  },
});

// Startup
module.exports = new Neonode();
