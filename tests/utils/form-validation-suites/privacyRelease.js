const { yesnoRadio } = require('./field-validation-suites');

module.exports = getDispute => {
  describe('doe-privacy-release', () => {
    yesnoRadio('doe-privacy-release', getDispute);
  });
};
