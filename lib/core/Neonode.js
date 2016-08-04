var glob     = require('glob');
var express  = require('express');
var http     = require('http');
var morgan   = require('morgan');
var path     = require('path');
var cwd      = process.cwd();

var Neonode = Class({}, 'Neonode')({
  prototype : {
    express           : null,
    http              : null,
    server            : null,
    io                : null,
    router            : null,
    env               : CONFIG.environment,

    controllers : {},
    models : {},

    init : function (){
      logger.info("Initializing Application");

      this.express = express;
      this.http = http;

      this.app = this.express();

      this.server = this.http.createServer(this.app);

      logger.info("Application Initialized");

      logger.info("Execute application._serverStart() to start the server");

      return this;
    },

    _configureApp : function(){
      var neonode = this;

      // *************************************************************************
      //                  Setup Thulium engine for Express
      // *************************************************************************
      logger.info("Setting Thulium Engine for Express");
      this.app.engine('html', require('thulium-express'));
      this.app.set('view engine', 'html');
      this.app.set('views', 'views');

      this.app.enable("trust proxy");

      // *************************************************************************
      //                            Static routes
      // *************************************************************************
      this.app.use('/', this.express.static('public'));

      // *************************************************************************
      //                            Request Logging
      // *************************************************************************
      this.app.use(morgan('combined', {stream: logger.stream}));

      return this;
    },

    _serverStop : function(){
      this.server.close();
    },

    _serverStart : function(){
      this.server.listen(CONFIG[CONFIG.environment].port);
    },

    loadControllers : function(){
      var neonode = this;

      this._configureApp();

      logger.info('Loading Models');

      glob.sync("models/*.js").forEach(function(file) {
        logger.info('Loading ' + file + '...')
        var model = require(path.join(cwd, '/' + file));
      });

      logger.info('Loading BaseController.js');
      require('./controllers/BaseController.js');

      logger.info('Loading RestfulController.js');
      require('./controllers/RestfulController.js');

      glob.sync("controllers/**/*.js").forEach(function(file) {
        logger.info('Loading ' + file + '...');

        var fileNameArray = file.split('/');

        var controller = require(path.join(cwd, '/' + file));

        var controllerName = controller.name;

        if (fileNameArray.length > 2) {
          fileNameArray.shift(1); // remove the first item of the array (controllers)
          fileNameArray.pop(1); // remove the last item of the array (filename)

          controllerName = fileNameArray.join('.') + '.' + controller.name;
        }

        neonode.controllers[controllerName] = controller;
      });

      // *************************************************************************
      //                      External Middlewares
      // *************************************************************************
      CONFIG.middlewares.forEach(function(middleware) {
        logger.info('Loading ' + middleware.name + ' middleware: ' + middleware.path + '...');

        var middlewareFile = require(path.join(cwd, '/' + middleware.path));

        neonode.app.use(middlewareFile);
      });

      return this;
    }
  }
});

//Startup
module.exports = new Neonode();
