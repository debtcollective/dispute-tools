const { text, usStates, zip, date } = require('./field-validation-suites');

module.exports = getDispute => {
  describe('schoolName', () => {
    text('schoolName', getDispute, true);
  });

  describe('school-address', () => {
    text('school-address', getDispute, true);
  });

  describe('school-city', () => {
    text('school-city', getDispute, true);
  });

  describe('school-state', () => {
    usStates('school-state', getDispute, true);
  });

  describe('school-zip-code', () => {
    zip('school-zip-code', getDispute, true);
  });

  describe('school-attended-from', () => {
    date('school-attended-from', getDispute, true);
  });

  describe('school-attended-to', () => {
    date('school-attended-to', getDispute, true);
  });
};
