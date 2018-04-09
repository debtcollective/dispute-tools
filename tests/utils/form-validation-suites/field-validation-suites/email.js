const { expectRule, performTest } = require('../helpers');
const required = require('./required');

const expectEmail = expectRule('email');

module.exports = (fieldName, getDispute, isRequired = true) => {
  required(fieldName, getDispute, isRequired);

  [
    'alex@example.com',
    'alex+test@example.com',
    'alex.test@example.com',
    'alex++test@example.com',
    'alex.t.e.s.t@example.com',
    'alex.test@mail.example.com',
  ].forEach(email => {
    it(`should accept ${email}`, performTest(getDispute, fieldName, email, expectEmail, true));
  });

  ['alex', 'alex@example', '@example.com', 'alexexample.com', 'alex+example.com'].forEach(email => {
    it(`should not accept ${email}`, performTest(getDispute, fieldName, email, expectEmail));
  });
};
