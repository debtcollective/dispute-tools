/* globals Class, Krypton, */

const DisputeTool = Class('DisputeTool').inherits(Krypton.Model)({
  tableName: 'DisputeTools',
  attributes: ['id', 'name', 'about', 'completed', 'data', 'createdAt', 'updatedAt'],
});

module.exports = DisputeTool;
