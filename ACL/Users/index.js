module.exports = {
  Visitor: [
    [false],
    ['activation', true],
    ['create', true],
    ['new', true],
  ],
  User: [
    [false],
    // ['activation', false]
    ['edit', 'update', 'show', (req) => {
      if (req.params.id === req.user.id) {
        return true;
      }

      return false;
    }],
  ],
  // CollectiveManager: [],
  Admin: [
    [true],
  ],
};
