const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

const cwd = process.cwd();
const configFile = path.join(cwd, '/config/config.js');

global.CONFIG = require(configFile);

if (!fs.existsSync(path.join(cwd, '/log'))) {
  mkdirp.sync(path.join(cwd, '/log'), 744);
}

global.logger = require('./logger');

require('neon');
require('neon/stdlib');

require('krypton-orm');

// *************************************************************************
//                        Error monitoring for neon
// *************************************************************************
// prettier-ignore
if (CONFIG[CONFIG.environment].enableLithium) { // eslint-disable-line
  require(__dirname, '/vendor/lithium');
}
