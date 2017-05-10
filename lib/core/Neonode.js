/* globals Class, CONFIG, logger */

const glob = require('glob');
const helmet = require('helmet');
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

      logger.info('Application Initialized');


      logger.info('Execute application._serverStart() to start the server');

      return this;
    },

    _configureApp() {
      this.app = this.express();
      this.app.use(helmet());

      // *************************************************************************
      //                  Setup Pug engine for Express
      // *************************************************************************
      logger.info('Setting Pug Engine for Express');
      this.app.set('view engine', 'pug');
      this.app.set('views', 'views');

      if (CONFIG.environment === 'production') {
        this.app.enable('trust proxy');
      }

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
      this.server = this.http.createServer(this.app);
      this.server.listen(CONFIG.env().port);
    },

    loadModels() {
      logger.info('Loading Models');

      glob.sync('models/*.js').forEach((file) => {
        logger.info(`Loading ${file} ...`);
        require(path.join(cwd, file));
      });

      // Load Model Relations
      glob.sync('model-relations/*.js').forEach((file) => {
        logger.info(`Loading ${file} ...`);
        require(path.join(cwd, file));
      });

      // Load Mailers
      glob.sync('mailers/*.js').forEach((file) => {
        logger.info(`Loading ${file} ...`);
        require(path.join(cwd, file));
      });
    },

    loadApplicationServer() {
      this._configureApp();

      // *************************************************************************
      //                      External Middlewares
      // *************************************************************************
      CONFIG.middlewares.forEach((middleware) => {
        logger.info(`Loading ${middleware.name} middleware: ${middleware.path} ...`);

        const middlewareFile = require(path.join(cwd, middleware.path));

        this.app.use(middlewareFile);
      });
    },

    loadControllers() {
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

      return this;
    },
  },
});

// Startup
module.exports = new Neonode();
