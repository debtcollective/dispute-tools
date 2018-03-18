const { expect } = require('chai');
const { ContactUsEmail } = require('../../../services/email');
const { mailers: contactEmail } = require('../../../config/config');

const { ForVisitor } = ContactUsEmail;

describe('ContactUsEmail.ForVisitor', () => {
  describe('constructor', () => {
    it('should set the from address to the contact email', () => {
      const email = new ForVisitor('a message', 'visitor@example.com', 'Veronica Visitor');
      expect(email.from).exist;
      expect(
        email.from.endsWith(`<${contactEmail}>`),
        'Expected to address to be the contact email',
      ).true;
    });

    it("should set the to address to the visitor's", () => {
      const email = new ForVisitor('a message', 'visitor@example.com', 'Veronica Visitor');
      expect(email.to).exist;
      expect(email.to).eq('Veronica Visitor <visitor@example.com>');
    });

    it('should set the locals with the passed in message', () => {
      const message = 'a message for the organizers';
      const email = new ForVisitor(message, '', '');
      expect(email.locals.message).exist;
      expect(email.locals.message).eq(message);
    });

    it('should set the locals with the passed in name of the visitor', () => {
      const name = 'Veronica Visitor';
      const email = new ForVisitor('', '', name);
      expect(email.locals.name).exist;
      expect(email.locals.name).eq(name);
    });
  });

  describe('render', () => {
    it('should be able to render', () => {
      const email = new ForVisitor(
        'a message for the organizers',
        'visitor@example.com',
        'Veronica Visitor',
      );
      const html = email.render();
      expect(html).exist;
      expect(html).include(email.locals.message);
      expect(html).include('You have sent the following message');
    });
  });
});
