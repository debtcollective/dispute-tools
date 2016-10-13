module.exports = {
  Visitor: [
    [false],
    ['activation', 'activate', 'create', 'new', 'show', true],
  ],
  User: [
    [false],
    ['activation', 'show', true],
    ['edit', 'update', (req) => {
      if (req.params.id === req.user.id) {
        return true;
      }

      return false;
    }],
  ],
  Admin: [
    [true],
  ],
};
