module.exports = {
  Visitor: [
    // [false],
    // ['new', true],
    // ['create', true],
    // ['activation', true],
    true,
  ],
  User: [
    ['edit', 'update', 'show', (req) => {
      if (req.params.id === req.user.id) {
        return true;
      }

      return false;
    }],
  ],
  // CollectiveManager: [],
  // Admin: [],
};
