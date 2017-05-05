var path = require('path');
var fs = require('fs');

require(path.join(__dirname, 'bootstrap.js'));

if (fs.existsSync(path.join(process.cwd(), '/lib/boot.js'))) {
  require(path.join(process.cwd(), '/lib/boot.js'));
}

var neonode;

global.neonode = neonode = require(path.join(__dirname, 'Neonode'));

neonode.loadModels();

if (process.env.HEADLESS !== '1') {
  neonode.loadControllers();
  neonode.loadApplicationServer();
}

module.exports = neonode;
