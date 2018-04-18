const _ = require('lodash');
const { performTest, expectRule } = require('../helpers');

const expectOneOf = expectRule('oneOf');

module.exports = (fieldName, getDispute, options, notAllowed = ['bogus flogus']) => {
  options.forEach(option => {
    it(
      `should accept ${typeof option} ${option}`,
      performTest(getDispute, fieldName, option, expectOneOf, true),
    );
  });

  for (let i = 0; i < options.length * 5; i++) {
    const opts = new Array(Math.floor(options.length / 2)).fill(null).map(() => _.sample(options));
    it(`should accept [${opts}]`, performTest(getDispute, fieldName, opts, expectOneOf, true));
  }

  notAllowed.forEach(option => {
    it(
      `should not allow ${typeof option} ${option}`,
      performTest(getDispute, fieldName, option, expectOneOf),
    );
  });
};
