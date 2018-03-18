/* globals Class, BaseMailer, CONFIG */

const UserMailer = Class('UserMailer').inherits(BaseMailer)({
  _options: {
    from: `The Debt Collective <${CONFIG.mailers.senderEmail}>`,
    subject: 'The Debt Collective',
  },

  sendSubscription(...args) {
    return this._send('sendSubscription', ...args);
  },
});

module.exports = UserMailer;
