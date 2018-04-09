const { expect } = require('chai');
const Checkit = require('../../../shared/Checkit');

describe('Debt Collective Checkit extensions', () => {
  describe('social security number', () => {
    const checkit = new Checkit({ social: ['ssn'] });
    it('should handle numbers', () => {
      const [err, res] = checkit.validateSync({ social: 123121234 });
      expect(err).null;
      expect(res).exist;
    });

    it('should handle strings', () => {
      const [err, res] = checkit.validateSync({ social: '123121234' });
      expect(err).null;
      expect(res).exist;
    });

    it('should not allow letters', () => {
      const [err, res] = checkit.validateSync({ social: 'asdasasdf' });
      expect(err).exist;
      expect(res).null;
    });

    it('should return a meaningful error', () => {
      const [{ errors }, res] = checkit.validateSync({ social: 0 });
      expect(errors).exist;
      expect(errors.social).exist;
      expect(errors.social.message).eq('Invalid social security number');
      expect(res).null;
    });

    it('should allow dashes', () => {
      const [err, res] = checkit.validateSync({ social: '123-12-1234' });
      expect(err).to.be.null;
      expect(res).exist;
    });
  });

  describe('oneOf', () => {
    const checkit = new Checkit({ enumed: ['oneOf:Hello, world, MONSTERS'] });
    it('should pass when the option is valid', () => {
      const [err, res] = checkit.validateSync({ enumed: 'Hello' });
      expect(err).null;
      expect(res).exist;
    });

    it('should not pass when the option is invalid', () => {
      const [err, res] = checkit.validateSync({ enumed: 'Blarg' });
      expect(err).exist;
      expect(res).null;
    });

    it('should return a meaningful error message', () => {
      const [{ errors }, res] = checkit.validateSync({ enumed: 'Blarg' });
      expect(errors).exist;
      expect(errors.enumed).exist;
      expect(errors.enumed.message).eq(
        'Invalid option. The value of enumed was not one of Hello, world, MONSTERS',
      );
      expect(res).null;
    });

    it('should be case sensitive by default', () => {
      const [err, res] = checkit.validateSync({ enumed: 'monsters' });
      expect(err).exist;
      expect(res).null;
    });

    it('should allow case insensitivity', () => {
      const [err, res] = new Checkit({
        enumed: ['oneOf: Hello, world, MONSTERS:false'],
      }).validateSync({ enumed: 'monsters' });
      expect(err).null;
      expect(res).exist;
    });

    it('should trim whitespace from the passed in value', () => {
      const [err, res] = checkit.validateSync({ enumed: '            Hello           ' });
      expect(err).null;
      expect(res).exist;
    });

    it('should handle array input', () => {
      const [err, res] = checkit.validateSync({ enumed: ['Hello', 'MONSTERS'] });
      expect(err).null;
      expect(res).exist;
    });

    it('should pass on empty array', () => {
      const [err, res] = checkit.validateSync({ enumed: [] });
      expect(err).null;
      expect(res).exist;
    });
  });

  describe('parsableDate', () => {
    const checkit = new Checkit({ d: ['parsableDate'] });

    it('should accept MM/DD/YYYY format', () => {
      const [err, res] = checkit.validateSync({ d: '05/16/1994' });
      expect(err).null;
      expect(res).exist;
    });
  });
});
