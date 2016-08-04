#!/usr/bin/env node

var path = require('path');

var neonode = require(path.join(process.cwd(), '/lib/core'));

neonode._serverStart();

logger.info('Server started listening on http://localhost:' + CONFIG[CONFIG.environment].port);
