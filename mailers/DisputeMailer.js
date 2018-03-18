/* globals Class, BaseMailer, CONFIG, User */

const DisputeMailer = Class('DisputeMailer').inherits(BaseMailer)({
  _options: {
    from: `The Debt Collective <${CONFIG.mailers.senderEmail}>`,
    subject: 'The Debt Collective',
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
