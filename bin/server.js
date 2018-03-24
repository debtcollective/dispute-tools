#!/usr/bin/env node
const path = require('path');

const neonode = require(path.join(process.cwd(), '/lib/core'));
const { logger } = require('../lib');
const { port } = require('../config/config');

neonode._serverStart();

logger.info(`Server started listening on http://localhost:${port}`);
