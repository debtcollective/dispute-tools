module.exports = {
  Visitor: [
    [false],
    ['activation', true],
    ['activate', true],
    ['create', true],
    ['new', true],
  ],
  User: [
    [false],
    ['activation', true],
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
