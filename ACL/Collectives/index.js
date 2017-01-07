/* globals CollectiveBans */
module.exports = {
  Visitor: [
    ['join', false],
    ['index', 'show', true],
  ],
  User: [
    ['index', true],
    // Users are already blocked from the passport middleware
    ['join', true],
  ],
};
