/* globals Class, BaseMailer, CONFIG */

const UserMailer = Class('UserMailer').inherits(BaseMailer)({
  _options: {
    from: CONFIG.env().mailers.senderEmail,
    subject: 'The Debt Collective',
  },

  sendActivation: function sendActivation(...args) {
    return this._send('sendActivation', ...args);
  },
});

module.exports = UserMailer;
