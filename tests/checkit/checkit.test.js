const Checkit = require('../../shared/Checkit');
const assert = require('assert');
const { expect } = require('chai');
const spies = require('chai-spies');
const chai = require('chai');
const moment = require('moment');

chai.use(spies);

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
        // runs the validations to return "validated" object and error for given rule ("ssn")
        const prepareErrorCase = (checkitInstance, value) => {
          const [err, validated] = checkitInstance.validateSync({
            testInputValue: value,
          });

          const { errors } = err;
          // Every input can have an array of errors related to the defined constrains
          const { errors: inputErrors } = errors.testInputValue;
          const fieldError = inputErrors.find(({ rule }) => rule === 'ssn');

          return [validated, fieldError];
        };

        it('for less than 9 characters', () => {
          const [validated, ssnError] = prepareErrorCase(checkit, '12509340');

          expect(validated).to.equal(null);
          expect(ssnError.message).to.equal(checkit.messages.ssn);
        });

        it('for more than 9 characters', () => {
          const [validated, ssnError] = prepareErrorCase(checkit, '1250934010');

          expect(validated).to.equal(null);
          expect(ssnError.message).to.equal(checkit.messages.ssn);
        });

        it('for value with letters', () => {
          const [validated, ssnError] = prepareErrorCase(checkit, '12509340A');

          expect(validated).to.equal(null);
          expect(ssnError.message).to.equal(checkit.messages.ssn);
        });
      });

      describe('validates for', () => {
        it('for 9 characters', () => {
          const [err, validated] = checkit.validateSync({
            testInputValue: '125093401',
          });

          expect(err).to.equal(null);
          expect(validated.testInputValue).to.be.equal('125093401');
        });

        it('for 9 digits number', () => {
          const [err, validated] = checkit.validateSync({
            testInputValue: 125093401,
          });

          expect(err).to.equal(null);
          expect(validated.testInputValue).to.be.equal(125093401);
        });

        it('for 9 characters with dashes', () => {
          const [err, validated] = checkit.validateSync({
            testInputValue: '125-09-3401',
          });

          expect(err).to.equal(null);
          expect(validated.testInputValue).to.be.equal('125-09-3401');
        });
      });
    });

    describe('handles oneOf validation constrain', () => {
      // NOTE: This may need to be challenge as "oneOf" doesn't seems to be correct to handle multiple values
      it('allows array of values', () => {
        const checkit = new Checkit({
          testInputValue: ['oneOf:Foo, Bar'],
        });

        const [err, validated] = checkit.validateSync({
          testInputValue: ['Foo', 'Bar'],
        });

        expect(err).to.equal(null);

        expect(validated).to.be.an('object');
        assert.deepEqual(validated.testInputValue, ['Foo', 'Bar']);
      });

      it('allows empty arrays values', () => {
        const checkit = new Checkit({
          testInputValue: ['oneOf:Foo, Bar'],
        });

        const [err, validated] = checkit.validateSync({
          testInputValue: [],
        });

        expect(err).to.equal(null);

        expect(validated).to.be.an('object');
        assert.deepEqual(validated.testInputValue, []);
      });

      // NOTE: This may need to be challenge as if required undefined should not bypass the rule
      it('allows undefined values', () => {
        const checkit = new Checkit({
          testInputValue: ['oneOf:Foo, Bar'],
        });

        const [err, validated] = checkit.validateSync({
          testInputValue: undefined,
        });

        expect(err).to.equal(null);

        expect(validated).to.be.an('object');
        assert.deepEqual(validated.testInputValue, undefined);
      });

      describe('option "required" set', () => {
        const checkit = new Checkit({
          testInputValue: ['oneOf:Foo, Bar:false:required'],
        });

        it('does not allow empty arrays', () => {
          const [err, validated] = checkit.validateSync({
            testInputValue: [],
          });

          const { errors } = err;

          expect(validated).to.equal(null);
          expect(errors.testInputValue).to.be.an('object');

          // Every input can have an array of errors related to the defined constrains
          const { errors: inputErrors } = errors.testInputValue;
          const targetError = inputErrors.find(({ rule }) => rule === 'oneOf');

          // interpolate message as expected by the checkit library
          const expectedErrorMessage = checkit.messages.oneOf
            .replace('{{label}}', 'testInputValue')
            .replace('{{var_1}}', 'Foo, Bar');

          expect(targetError).to.be.an('object');
          expect(targetError.message).to.equal(expectedErrorMessage);
        });

        it('allows undefined values', () => {
          const checkit = new Checkit({
            testInputValue: ['oneOf:Foo, Bar'],
          });

          const [err, validated] = checkit.validateSync({
            testInputValue: undefined,
          });

          expect(err).to.equal(null);

          expect(validated).to.be.an('object');
          assert.deepEqual(validated.testInputValue, undefined);
        });
      });

      describe('case insensitive', () => {
        const checkit = new Checkit({
          testInputValue: ['oneOf:Foo, Bar:false'],
        });

        it('validates for value equals to option lowercased', () => {
          const [err, validated] = checkit.validateSync({
            testInputValue: 'foo',
          });

          expect(err).to.equal(null);

          expect(validated).to.be.an('object');
          expect(validated.testInputValue).to.be.equal('foo');
        });
      });

      describe('case sensitive', () => {
        it('validates with option exact value', () => {
          const checkit = new Checkit({
            testInputValue: ['oneOf:Foo, Bar'],
          });

          it('validates for value equals to option lowercased', () => {
            const [err, validated] = checkit.validateSync({
              testInputValue: 'Foo',
            });

            expect(err).to.equal(null);

            expect(validated).to.be.an('object');
            expect(validated.testInputValue).to.be.equal('Foo');
          });
        });

        it('return error for value equals to option lowercased', () => {
          const checkit = new Checkit({
            testInputValue: ['oneOf:Foo, Bar:true'],
          });

          const [err, validated] = checkit.validateSync({
            testInputValue: 'foo',
          });

          const { errors } = err;

          expect(validated).to.equal(null);
          expect(errors.testInputValue).to.be.an('object');

          // Every input can have an array of errors related to the defined constrains
          const { errors: inputErrors } = errors.testInputValue;
          const targetError = inputErrors.find(({ rule }) => rule === 'oneOf');

          // interpolate message as expected by the checkit library
          const expectedErrorMessage = checkit.messages.oneOf
            .replace('{{label}}', 'testInputValue')
            .replace('{{var_1}}', 'Foo, Bar');

          expect(targetError).to.be.an('object');
          expect(targetError.message).to.equal(expectedErrorMessage);
        });
      });
    });

    describe('handles parsableDate validation constrain', () => {
      it('allow "MM/DD/YYYY" format', () => {
        const checkit = new Checkit({
          testInputValue: ['parsableDate'],
        });

        const [err, validated] = checkit.validateSync({
          testInputValue: '12/28/2019',
        });

        expect(err).to.equal(null);
        expect(validated.testInputValue).to.be.equal('12/28/2019');
      });

      it('allow "DD/MM/YYYY" format', () => {
        const checkit = new Checkit({
          testInputValue: ['parsableDate'],
        });

        const [err, validated] = checkit.validateSync({
          testInputValue: '28/12/2019',
        });

        expect(err).to.equal(null);
        expect(validated.testInputValue).to.be.equal('28/12/2019');
      });

      // TODO: Will be great to find a better way to make sure we only accept two types of formats
      it('do not allow other formats', () => {
        const spyIsValid = chai.spy.on(moment.prototype, 'isValid');
        const val = Date.now();
        const checkit = new Checkit({
          testInputValue: ['parsableDate'],
        });

        const [err, validated] = checkit.validateSync({
          testInputValue: val,
        });

        expect(validated).to.equal(null);
        expect(err).not.to.equal(null);

        expect(spyIsValid).to.have.been.called();
      });
    });
  });
});
