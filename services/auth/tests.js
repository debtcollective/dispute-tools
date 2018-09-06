const isDisputeAdmin = ({ user }) => user.admin;

const loggedIn = ({ user }) => !!user;
const isDisputeOwner = ({ dispute, user }) => user.id === dispute.userId;
const ownerOrAdmin = req => [isDisputeAdmin, isDisputeOwner].some(test => test(req));

module.exports = {
  isDisputeAdmin,
  loggedIn,
  isDisputeOwner,
  ownerOrAdmin,
};
