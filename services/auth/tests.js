const isDisputeAdmin = ({ user }) => {
  if (user) {
    const groupNames = (user.groups || []).map(group => group.name);

    return groupNames.includes('dispute_pro');
  }

  return false;
};

const loggedIn = ({ user }) => user !== undefined;
const isDisputeOwner = ({ dispute, user }) => user.id === dispute.userId;
const ownerOrAdmin = req => [isDisputeAdmin, isDisputeOwner].some(test => test(req));

module.exports = {
  isDisputeAdmin,
  loggedIn,
  isDisputeOwner,
  ownerOrAdmin,
};
