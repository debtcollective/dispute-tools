const { expect } = require('chai');
const Checkit = require('../../../shared/Checkit');

describe('Debt Collective Checkit extensions', () => {
  const checkit = new Checkit({ social: ['ssn'] });

  describe('social security number', () => {
    it('should handle numbers', () => {
      const [err, res] = checkit.validateSync({ social: 123121234 });
      expect(err).to.be.null;
      expect(res).to.be.defined;
    });

    it('should handle strings', () => {
      const [err, res] = checkit.validateSync({ social: '123121234' });
      expect(err).to.be.null;
      expect(res).to.be.defined;
    });

    it('should not allow letters', () => {
      const [err, res] = checkit.validateSync({ social: 'asdasasdf' });
      expect(err).to.be.defined;
      expect(res).to.be.null;
    });

    it('should return a meaningful error', () => {
      const [{ errors }, res] = checkit.validateSync({ social: 0 });
      expect(errors).to.be.defined;
      expect(errors.social).to.be.defined;
      expect(errors.social.message).to.eq('Invalid social security number');
      expect(res).to.be.null;
    });

    it('should allow dashes', () => {
      const [err, res] = checkit.validateSync({ social: '123-12-1234' });
      expect(err).to.be.null;
      expect(res).to.be.defined;
    });
  });
});
