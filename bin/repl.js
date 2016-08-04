#!/usr/bin/env node

var OS = require('os');
var path = require('path');
var REPL = require('repl');
var Module = require('module');

var _empty = '(' + OS.EOL + ')';
var exit = process.exit.bind(process);

var Neonode = require('../lib/core');

Neonode._serverStart();

REPL.start({
  stdout: process.stdout,
  stdin: process.stdin,
  eval: function (cmd, context, filename, callback) {
    if (cmd === _empty) {
      return callback();
    }

    try {
      callback(null, eval(cmd));
    } catch (e) {
      callback(e);
    }
  }
})
.on('exit', function() {
  console.log('bye bye!');
  exit();
})
.defineCommand('reload', {
  help: 'Reload modules from the current Neonode instance',
  action: function(name) {
    var files = 0;

    Object.keys(Module._cache).forEach(function(key) {
      if (name) {
        if (path.relative(process.cwd(), key).indexOf(name) > -1) {
          delete Module._cache[key];
          files += 1;
        }

        return;
      }

      if (key.indexOf('node_modules') === -1) {
        delete Module._cache[key];
        files += 1;
      }
    });

    setTimeout(function() {
      Neonode._serverStop();
      process.stdout.write('\n');

      // intentionally re-required
      Neonode = require('../lib/core');
      Neonode._serverStart();

      process.stdout.write(REPL.repl._initialPrompt);
    });

    process.stdout.write(files + ' file'
      + (files !== 1 ? 's were' : ' was') + ' reloaded\n');
  }
});
