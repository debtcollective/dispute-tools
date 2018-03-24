const { expect } = require('chai');
const { ContactUsEmail } = require('../../../services/email');
const { mailers: { contactEmail } } = require('../../../config/config');

const { ForAdmin } = ContactUsEmail;

describe('ContactUsEmail.ForAdmin', () => {
  describe('constructor', () => {
    it('should set the to address to the contact email', () => {
      const email = new ForAdmin('a message', 'visitor@example.com', 'Veronica Visitor');
      expect(email.to).exist;
      expect(email.to.slice(-(contactEmail.length + 2))).eq(`<${contactEmail}>`);
    });

    it("should set the from address to the visitor's", () => {
      const email = new ForAdmin('a message', 'visitor@example.com', 'Veronica Visitor');
      expect(email.from).exist;
      // It has to be the contact email so that SES doesn't get upset we're sending emails from unverified addresses
      expect(email.from).eq(`Veronica Visitor <${contactEmail}>`);
    });

    it('should set the locals with the passed in message', () => {
      const message = 'a message for the organizers';
      const email = new ForAdmin(message, '', '');
      expect(email.locals.message).exist;
      expect(email.locals.message).eq(message);
    });

    it('should set the locals with the passed in name of the visitor', () => {
      const name = 'Veronica Visitor';
      const email = new ForAdmin('', '', name);
      expect(email.locals.name).exist;
      expect(email.locals.name).eq(name);
    });
  });

  describe('render', () => {
    it('should be able to render', () => {
      const email = new ForAdmin(
        'a message for the organizers',
        'visitor@example.com',
        'Veronica Visitor',
      );
      const html = email.render();
      expect(html).exist;
      expect(html).include(email.locals.message);
      expect(html).include(email.locals.name);
    });
  });
});
