const { isDisputeAdmin, isDisputeOwner } = (module.exports = {
  isDisputeAdmin: ({ user }) => user && (user.admin || user.groups.includes('dispute-admin')),
  loggedIn: ({ user }) => user !== undefined,
  isDisputeOwner: ({ dispute, user }) => user.id === dispute.userId,
  ownerOrAdmin: req => [isDisputeAdmin, isDisputeOwner].some(test => test(req)),
});
