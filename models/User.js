/* global Krypton, Class */

const User = Class('User').inherits(Krypton.Model)({
  tableName: 'Users',
  validations: {},

  attributes: ['id', 'externalId', 'createdAt', 'updatedAt'],

  prototype: {
    init(config) {
      Krypton.Model.prototype.init.call(this, config);
    },
    setInfo(info) {
      return Object.assign(this, info);
    },
  },
});

module.exports = User;
