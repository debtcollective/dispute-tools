/* globals Class, BaseMailer, CONFIG, User */

const DisputeMailer = Class('DisputeMailer').inherits(BaseMailer)({
  _options: {
    from: CONFIG.env().mailers.senderEmail,
    subject: 'The Debt Collective',
  },

  sendToAdmins(locals) {
    const emails = CONFIG.env().mailers.disputesBCCAddresses;

    return this._send('sendToAdmins', emails, locals);
  },
});

module.exports = DisputeMailer;
