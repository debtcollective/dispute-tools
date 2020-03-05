#!/usr/bin/env node
require('module-alias/register');

require('$lib/core');
require('../jobs');
const { logger } = require('$lib');

logger.info('Workers running');
