const chai = require('chai');
const spies = require('chai-spies');
const Field = require('$form-definitions/validations');

chai.use(spies);

const expect = chai.expect;

describe('Field', () => {
  describe('constructor', () => {
    it('should assign any config properties passed in', () => {
      const f = new Field({ foo: 'bar', bing: 'bong', bang: 'baz' });
      expect(f.foo).eq('bar');
      expect(f.bing).eq('bong');
      expect(f.bang).eq('baz');
    });

    describe('yesno', () => {
      it('should add yesno FieldValidation validations', () => {
        const f = new Field({ yesno: true });
        expect(f.validations).include(...Field.FieldValidation.yesno.validations);
      });

      it('should add yesno FieldValidation attributes', () => {
        const f = new Field({ yesno: true });
        expect(f.attributes).include(Field.FieldValidation.yesno.attributes);
      });
    });

    describe('required', () => {
      it('should default to true', () => {
        const f = new Field();
        expect(f.required).true;
      });

      it('should be settable to false', () => {
        const f = new Field({ required: false });
        expect(f.required).false;
      });

      describe('when true', () => {
        it('should add the `required` validation', () => {
          const f = new Field({ required: true });
          expect(f.validations).include('required');
        });

        it('should add the `required` attribute', () => {
          const f = new Field({ required: true });
          expect(f.attributes).include({ required: 'required' });
        });
      });

      describe('when false', () => {
        it('should not add the `required` validation', () => {
          const f = new Field({ required: false });
          expect(f.validations).not.include('required');
        });

        it('should not add the `required` attribute', () => {
          const f = new Field({ required: false });
          expect(f.attributes).not.include({ required: 'required' });
        });
      });
    });

    describe('validations', () => {
      it('should accept an array of validation strings', () => {
        const f = new Field({ validations: ['hello', 'world'] });
        expect(f.validations).include('hello', 'world');
      });

      it('should accept an enum reference of a FieldValidation', () => {
        const f = new Field({ validations: Field.FieldValidation.text });
        expect(f.validations).include(...Field.FieldValidation.text.validations);
      });

      describe('when FieldValidation reference', () => {
        const fv = Field.FieldValidation.text;
        const f = new Field({ validations: fv, required: undefined });

        it('should set the validations to the validations from the FieldValidation instance', () => {
          expect(f.validations).include(...fv.validations);
        });

        it('should set the attributes to the attributes from the FieldValidation instance', () => {
          expect(f.attributes).include(fv.attributes);
        });

        it('should override the required when required is undefined', () => {
          expect(f.required).eq(fv.defaultRequired);
        });
      });
    });

    describe('attributes', () => {
      describe('when validations is FieldValidation reference', () => {
        const fv = Field.FieldValidation.text;

        it('should allow adding attributes aside from those included by the validation', () => {
          const f = new Field({ validations: fv, attributes: { hello: 'world' } });
          expect(f.attributes).include({ hello: 'world', ...fv.attributes });
        });
      });
    });
  });

  describe('getAttributesFromValidations', () => {
    it('returns maxLength attribute', () => {
      const validations = ['required', 'maxLength:256'];

      expect(Field.getAttributesFromValidations(validations, {})).to.deep.equal({
        maxlength: '256',
      });
    });

    it('returns minLength attribute', () => {
      const validations = ['required', 'minLength:256'];

      expect(Field.getAttributesFromValidations(validations, {})).to.deep.equal({
        minlength: '256',
      });
    });

    describe('when no validations to add', () => {
      it('returns empty object', () => {
        const validations = [];

        expect(Field.getAttributesFromValidations(validations, {})).to.deep.equal({});
      });
    });

    describe('when unexpected validations format', () => {
      it('behaves as expected', () => {
        const validations = [{ rule: 'foo' }];

        expect(() => Field.getAttributesFromValidations(validations, {})).to.throw();
      });
    });
  });
});
