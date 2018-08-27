const { isDisputeAdmin, isDisputeOwner } = (module.exports = {
  isDisputeAdmin: ({ user }) => user && (user.admin || user.groups.includes('dispute_pro')),
  loggedIn: ({ user }) => user !== undefined,
  isDisputeOwner: ({ dispute, user }) => user.id === dispute.userId,
  ownerOrAdmin: req => [isDisputeAdmin, isDisputeOwner].some(test => test(req)),
});
