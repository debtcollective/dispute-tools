const path = require('path');

const cwd = process.cwd();
const configFile = path.join(cwd, '/config/config.js');

global.CONFIG = require(configFile);

global.logger = require('./logger');

require('neon');
require('neon/stdlib');

require('krypton-orm');
