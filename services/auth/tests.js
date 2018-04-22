const t = {
  isDisputeAdmin: ({ user }) => user && (user.admin || user.groups.includes('dispute-admin')),
  loggedIn: ({ user }) => user !== undefined,
  isDisputeOwner: ({ dispute, user }) => user.id === dispute.userId,
  ownerOrAdmin: req => t.isDisputeAdmin(req) || t.isDisputeOwner(req),
};

module.exports = t;
