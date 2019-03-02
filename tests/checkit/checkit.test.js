const Checkit = require('../../shared/Checkit');
const { expect } = require('chai');

describe('Checkit', () => {
  describe('Validator', () => {
    it('responds to a custom ssn function', () => {
      expect(Checkit.Validator.prototype.ssn).to.be.a('function');
    });

    it('responds to a custom oneOf function', () => {
      expect(Checkit.Validator.prototype.oneOf).to.be.a('function');
    });

    it('responds to a custom parsableDate function', () => {
      expect(Checkit.Validator.prototype.parsableDate).to.be.a('function');
    });
  });

  describe('instance', () => {
    describe('handles ssn validation constrain', () => {
      const checkit = new Checkit({
        testInputValue: ['ssn'],
      });

      describe('return error', () => {
        it('for less than 9 characters', () => {
          const [err, validated] = checkit.validateSync({
            testInputValue: '12345678',
          });

          const { errors } = err;

          expect(validated).to.equal(null);
          expect(errors.testInputValue).to.be.an('object');

          // Every input can have an array of errors related to the defined constrains
          const { errors: inputErrors } = errors.testInputValue;
          const ssnError = inputErrors.find(({ rule }) => rule === 'ssn');

          expect(ssnError).to.be.an('object');
          expect(ssnError.message).to.equal(checkit.messages.ssn);
        });

        it('for more than 9 characters', () => {
          const [err, validated] = checkit.validateSync({
            testInputValue: '1234567890',
          });

          const { errors } = err;

          expect(validated).to.equal(null);
          expect(errors.testInputValue).to.be.an('object');

          // Every input can have an array of errors related to the defined constrains
          const { errors: inputErrors } = errors.testInputValue;
          const ssnError = inputErrors.find(({ rule }) => rule === 'ssn');

          expect(ssnError).to.be.an('object');
          expect(ssnError.message).to.equal(checkit.messages.ssn);
        });

        it('for value with letters', () => {
          const [err, validated] = checkit.validateSync({
            testInputValue: '1234A6789',
          });

          const { errors } = err;

          expect(validated).to.equal(null);
          expect(errors.testInputValue).to.be.an('object');

          // Every input can have an array of errors related to the defined constrains
          const { errors: inputErrors } = errors.testInputValue;
          const ssnError = inputErrors.find(({ rule }) => rule === 'ssn');

          expect(ssnError).to.be.an('object');
          expect(ssnError.message).to.equal(checkit.messages.ssn);
        });
      });

      describe('validates for', () => {
        it('for 9 characters', () => {
          const [err, validated] = checkit.validateSync({
            testInputValue: '123456789',
          });

          expect(err).to.equal(null);

          expect(validated).to.be.an('object');
          expect(validated.testInputValue).to.be.equal('123456789');
        });

        it('for 9 digits number', () => {
          const [err, validated] = checkit.validateSync({
            testInputValue: 123456789,
          });

          expect(err).to.equal(null);

          expect(validated).to.be.an('object');
          expect(validated.testInputValue).to.be.equal(123456789);
        });

        it('for 9 characters with dashes', () => {
          const [err, validated] = checkit.validateSync({
            testInputValue: '1234-56-78-9',
          });

          expect(err).to.equal(null);

          expect(validated).to.be.an('object');
          expect(validated.testInputValue).to.be.equal('1234-56-78-9');
        });
      });
    });
  });
});
