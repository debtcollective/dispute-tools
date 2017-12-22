/* globals logger */

const glob = require('glob');
const Mocha = require('mocha');
const path = require('path');

const mocha = new Mocha();
mocha.reporter('spec');
mocha.timeout(5000);

require(path.join(process.cwd(), '/bin/server.js'));

const testDir = path.join(process.cwd(), 'tests', 'integration');

const globOptions = {
  cwd: testDir, // search the integration directory
  matchBase: true }; // search entire tree

glob.sync('*.js', globOptions)
  .filter((filePath) => {
    const fileName = path.parse(filePath).base;
    return (fileName.indexOf(process.argv[2]) !== -1);
  })
  .forEach((file) => {
    mocha.addFile(path.join(testDir, file));
  });

// run Mocha
mocha.run((failures) => {
  process.on('exit', () => {
    process.exit(failures);
  });
  process.exit();
});


process.on('error', (err) => {
  logger.error(err, err.stack);
  process.exit(1);
});
