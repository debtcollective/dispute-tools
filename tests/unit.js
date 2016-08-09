global.expect = require('chai').expect;
global.sa = require('superagent');
global.Promise = require('bluebird');

var glob = require('glob');
var Mocha = require('mocha');
var path = require('path');

var mocha = new Mocha();
mocha.reporter('spec');

require(path.join(process.cwd(), '/bin/server.js'));

Promise.resolve()
  .then(function () {
    glob.sync('tests/unit/**/*.js')
      .filter(function (filePath) {
        var fileName = path.parse(filePath).base;

        return (fileName.indexOf(process.argv[2]) !== -1)
      })
      .forEach(function (file) {
        mocha.addFile(path.join(process.cwd(), file));
      });

    return Promise.resolve();
  })
  .then(function () {
    // run Mocha
    mocha.run(function (failures) {
      process.on('exit', function () {
        process.exit(failures);
      });
      process.exit();
    });
  })
  .catch(function (err) {
    logger.error(err, err.stack);
    process.exit(1);
  });
