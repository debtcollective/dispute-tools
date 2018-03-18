const { expect } = require('chai');
const { CompletedDisputeEmail } = require('../../../services/email');

const { ForAdmin, ForMember } = CompletedDisputeEmail;

describe('CompletedDisputeEmail', () => {
  let forAdminSend;
  let forMemberSend;
  let forAdminSent;
  let forMemberSent;
  before(() => {
    forAdminSend = ForAdmin.prototype.send;
    forMemberSend = ForMember.prototype.send;
    ForAdmin.prototype.send = function send() {
      forAdminSent = true;
      return Promise.resolve();
    };
    ForMember.prototype.send = function send() {
      forMemberSent = true;
      return Promise.resolve();
    };
  });
  after(() => {
    ForAdmin.prototype.send = forAdminSend;
    ForMember.prototype.send = forMemberSend;
  });

  it('should send the ForAdmin email', async () => {
    const email = new CompletedDisputeEmail({ fullname: 'Mercedes Member' }, { id: 12345 });

    await email.send();

    expect(forAdminSent).true;
  });

  it('should send the ForVisitor email', async () => {
    const email = new CompletedDisputeEmail({ fullname: 'Mercedes Member' }, { id: 12345 });

    await email.send();

    expect(forMemberSent).true;
  });
});
