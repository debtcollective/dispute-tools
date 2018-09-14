const { expect } = require('chai');
const { ContactUsEmail } = require('$services/messages');

const { ForAdmin, ForVisitor } = ContactUsEmail;

describe('ContactUsEmail', () => {
  let forAdminSend;
  let forVisitorSend;
  let forAdminSent;
  let forVisitorSent;
  before(() => {
    forAdminSend = ForAdmin.prototype.send;
    forVisitorSend = ForVisitor.prototype.send;
    ForAdmin.prototype.send = function send() {
      forAdminSent = true;
      return Promise.resolve();
    };
    ForVisitor.prototype.send = function send() {
      forVisitorSent = true;
      return Promise.resolve();
    };
  });
  after(() => {
    ForAdmin.prototype.send = forAdminSend;
    ForVisitor.prototype.send = forVisitorSend;
  });

  it('should send the ForAdmin email', async () => {
    const email = new ContactUsEmail(
      'a message for the organizers',
      'visitor@example.com',
      'Pheobe Visitor',
    );

    await email.send();

    expect(forAdminSent).true;
  });

  it('should send the ForVisitor email', async () => {
    const email = new ContactUsEmail(
      'a message for the organizers',
      'visitor@example.com',
      'Pheobe Visitor',
    );

    await email.send();

    expect(forVisitorSent).true;
  });
});
