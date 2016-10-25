/* globals Class, Krypton, Collective */

const Collective = Class('Collective').inherits(Krypton.Model)({
  tableName: 'Collectives',
  validations: {
    name: ['required'],
  },
  attributes: ['id', 'name', 'description', 'manifest', 'createdAt', 'updatedAt'],
});

module.exports = Collective;
