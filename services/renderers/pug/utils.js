const moment = require('moment');

const utils = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  moment,
};

module.exports = Object.assign(utils, {
  withUtils(locals) {
    // With locals last so overlapping properties are taken from locals instead
    // of being overwritten by a utility
    return Object.assign({}, { UTILS: utils }, locals);
  },
});
