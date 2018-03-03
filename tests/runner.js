/* globals logger */

const glob = require('glob');
const path = require('path');
const Mocha = require('mocha');

const mocha = new Mocha();
mocha.reporter('spec');
mocha.timeout(5000);

module.exports = function runTests(testDir) {
  require(path.join(process.cwd(), '/bin/server.js'));

  const globOptions = {
    cwd: testDir,
    matchBase: true, // search entire tree to find tests in subfolders
  };

  glob
    .sync('*.js', globOptions)
    .filter(filePath => {
      const fileName = path.parse(filePath).base;
      return fileName.indexOf(process.argv[2]) !== -1;
    })
    .forEach(file => {
      mocha.addFile(path.join(testDir, file));
    });

  // mocha.addFile(path.resolve(__dirname, 'integration', 'controllers', 'DisputesControllerTest.js'));

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
};
