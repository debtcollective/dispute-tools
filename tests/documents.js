const path = require('path');
const testRunner = require('./runner');

const TESTDIR = path.join(process.cwd(), 'tests', 'documents');

testRunner(TESTDIR);
