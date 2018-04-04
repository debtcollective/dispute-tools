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
      return Object.assign(this, {
        ...info,
        // Discourse will return an object with an id,
        // so this way we make sure our database id doesn't get overwritten
        id: this.id,
        external_id: info.id,
      });
    },
  },
});

module.exports = User;
