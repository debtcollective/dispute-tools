const { expect } = require('chai');
const { ContactUsEmail } = require('$services/messages');

const { ForAdmin } = ContactUsEmail;

describe('ContactUsEmail', () => {
  let forAdminSend;
  let forAdminSent;
  before(() => {
    forAdminSend = ForAdmin.prototype.send;
    ForAdmin.prototype.send = function send() {
      forAdminSent = true;
      return Promise.resolve();
    };
  });
  after(() => {
    ForAdmin.prototype.send = forAdminSend;
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
});
