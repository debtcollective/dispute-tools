/* eslint-disable no-console */

import foo from '../modules/foo';
import { bar, baz } from '../modules/bar';

console.log(`application::module:${foo}`);
console.log(`application::module:${bar}:${baz()}`);
