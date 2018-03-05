/* globals Class, Krypton, Dispute, DisputeStatus */

const path = require('path');

const DisputeTool = Class('DisputeTool').inherits(Krypton.Model)({
  tableName: 'DisputeTools',
  attributes: ['id', 'name', 'about', 'excerpt', 'completed', 'createdAt', 'updatedAt'],

  async findById(id) {
    const [dt] = await DisputeTool.query()
      .where({ id })
      .limit(1);

    return dt;
  },

  prototype: {
    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      const dataFile = path.join(process.cwd(), 'lib', 'data', 'dispute-tools', `${this.id}.js`);

      delete require.cache[require.resolve(dataFile)];

      this.data = require(dataFile);
    },
  },
});

module.exports = DisputeTool;
