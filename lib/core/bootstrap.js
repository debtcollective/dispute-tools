var path  = require('path');
var cwd   = process.cwd();
var fs    = require('fs');
var mkdirp = require('mkdirp');

var configFile = path.join(cwd, '/config/config.js');

global.CONFIG = require(configFile);

if (!fs.existsSync(path.join(cwd, '/log'))) {
    mkdirp.sync(path.join(cwd, '/log'), 0744);
}

global.logger = require('./logger');

require('neon');
require('neon/stdlib');
require('thulium'); // Ultra fast templating engine. See https://github.com/escusado/thulium

require('krypton-orm');

// *************************************************************************
//                        Error monitoring for neon
// *************************************************************************
if (CONFIG[CONFIG.environment].enableLithium) {
  require(__dirname, '/vendor/lithium');
}
