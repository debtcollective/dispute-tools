/* globals logger */

const glob = require('glob');
const path = require('path');
const Mocha = require('mocha');
const _ = require('lodash');

require('chai').use(require('chai-as-promised'));

const mocha = new Mocha();
mocha.reporter('spec');
mocha.timeout(5000);

module.exports = function runTests(testDir) {
  require(path.join(process.cwd(), '/bin/server.js'));

  const globOptions = {
    cwd: testDir,
    matchBase: true, // search entire tree to find tests in subfolders
  };

  // Allow passing in a regex and only run files that match
  // otherwise just run every file
  const matches =
    process.argv.length > 2
      ? (() => {
          const r = new RegExp(_.last(process.argv));
          return file => r.test(file);
        })()
      : _.identity;

  glob.sync('*.js', globOptions).forEach(file => {
    if (matches(file)) {
      mocha.addFile(path.join(testDir, file));
    }
  });

  // run Mocha
  mocha.run(failures => {
    process.on('exit', () => {
      process.exit(failures);
    });

    process.exit();
  });

  process.on('error', err => {
    logger.error(err, err.stack);

    process.exit(1);
  });

  // Workaround to make Mocha fail on UnhandledPromiseRejection errors
  // https://github.com/mochajs/mocha/issues/2640#issuecomment-348985952
  let unhandledRejectionExitCode = 0;

  process.on('unhandledRejection', reason => {
    unhandledRejectionExitCode = 1;
    throw reason;
  });

  process.prependListener('exit', code => {
    if (code === 0) {
      process.exit(unhandledRejectionExitCode);
    }
  });
};
