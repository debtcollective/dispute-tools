#!/usr/bin/env node
/* globals logger, CONFIG */

const path = require('path');

const neonode = require(path.join(process.cwd(), '/lib/core'));

neonode._serverStart();

logger.info(
  `Server started listening on http://localhost:${
    CONFIG[CONFIG.environment].port
  }`,
);
