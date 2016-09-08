/* globals Class, BaseMailer, CONFIG, User */

const DisputeMailer = Class('DisputeMailer').inherits(BaseMailer)({
  _options: {
    from: CONFIG.env().mailers.senderEmail,
    subject: 'The Debt Collective',
  },

  sendToAdmins: function sendToAdmins(locals) {
    return User.query()
      .where('role', 'Admin')
      .then((admins) => {
        const emails = admins.map((admin) => {
          return admin.email;
        });

        return this._send('sendToAdmins', emails, locals);
      });
  },
});

module.exports = DisputeMailer;
