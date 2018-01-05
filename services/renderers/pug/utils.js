const utils = {
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'],
  get monthString() {
    return this.months[new Date().getMonth()];
  },
  get currDateFormatted() {
    const now = new Date();
    return `${this.monthString} ${now.getDate()}, ${now.getFullYear()}`;
  },
};

module.exports = Object.assign(utils, {
  withUtils(locals) {
    // With locals last so overlapping properties are taken from locals instead
    // of being overwritten by a utility
    return Object.assign({}, { UTILS: utils }, locals);
  },
});
