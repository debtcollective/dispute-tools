module.exports = {
  isDisputeAdmin: ({ user }) => user && (user.admin || user.groups.includes('dispute-admin')),
  loggedIn: ({ user }) => user !== undefined,
};
