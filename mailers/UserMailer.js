/* globals Class, BaseMailer, CONFIG */

const UserMailer = Class('UserMailer').inherits(BaseMailer)({
  _options: {
    from: `'The Debt Collective' <${CONFIG.env().mailers.senderEmail}>`,
    subject: 'The Debt Collective',
  },

  sendActivation(...args) {
    return this._send('sendActivation', ...args);
  },

  sendResetPasswordLink(...args) {
    return this._send('sendResetPasswordLink', ...args);
  },

  sendDispute(...args) {
    return this._send('sendDispute', ...args);
  },

  sendDisputeToAdmin(locals) {
    const mails = CONFIG.env().mailers.disputesBCCAddresses;

    return this._send('sendDisputeToAdmin', mails, locals);
  },
});

module.exports = UserMailer;
