#!/usr/bin/env node
require('module-alias/register');

const neonode = require('$lib/core');
const { logger } = require('$lib');
const { port } = require('$config/config');

neonode._serverStart();

logger.info(`Server started listening on http://localhost:${port}`);
