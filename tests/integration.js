const path = require('path');
const testRunner = require('./runner');

const TESTDIR = path.join(process.cwd(), 'tests', 'integration');

testRunner(TESTDIR);
