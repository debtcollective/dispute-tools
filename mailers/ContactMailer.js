/* globals Class, BaseMailer, CONFIG */

const ContactMailer = Class('ContactMailer').inherits(BaseMailer)({
  _options: {
    from: null,
    subject: 'Contact',
  },

  sendMessage(...args) {
    return this._send('sendMessage', ...args);
  },
});

module.exports = ContactMailer;
