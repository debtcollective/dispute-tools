var path = require('path');
var fs = require('fs');

require(path.join(__dirname, 'bootstrap.js'));

if (fs.existsSync(path.join(process.cwd(), '/lib/boot.js'))) {
  require(path.join(process.cwd(), '/lib/boot.js'));
}

var neonode;

global.neonode = neonode = require(path.join(__dirname, 'Neonode'));

neonode.loadControllers();

module.exports = neonode;
