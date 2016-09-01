const Collective = Class('Collective').inherits(Krypton.Model)({
  tableName: 'Collectives',
  validations: {
    name: ['required'],
  },
  attributes: ['id', 'name', 'createdAt', 'updatedAt'],
});
