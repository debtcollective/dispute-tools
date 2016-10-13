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

  sendStatusToUser(locals) {
    return User.query()
      .where({ id: locals.dispute.userId })
      .include('account')
      .then(([user]) => {
        locals.user = user;

        return this._send('sendStatusToUser', user.email, locals);
      });
  },
});

module.exports = DisputeMailer;
