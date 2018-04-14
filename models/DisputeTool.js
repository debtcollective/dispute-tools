/* globals Class, Krypton, Dispute, DisputeStatus */

const path = require('path');
const _ = require('lodash');

const DisputeTool = Class('DisputeTool').inherits(Krypton.Model)({
  tableName: 'DisputeTools',
  attributes: ['id', 'name', 'about', 'excerpt', 'completed', 'createdAt', 'updatedAt'],

  async findById(id) {
    const [dt] = await DisputeTool.query()
      .where({ id })
      .limit(1);

    return dt;
  },

  async findByDispute(dispute) {
    return await DisputeTool.findById(dispute.disputeToolId);
  },

  async findBySlug(slug) {
    const [tool] = await DisputeTool.query()
      .where(
        'readable_name',
        slug
          .split('-')
          .map(_.capitalize)
          .join(' '),
      )
      .first();

    return tool;
  },

  prototype: {
    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.slug = this.readableName.toLowerCase().replace(/ /g, '-');
      const dataFile = path.join(
        process.cwd(),
        'lib',
        'data',
        'form-definitions',
        `${this.slug}.js`,
      );

      this.data = require(dataFile);
    },
  },
});

module.exports = DisputeTool;
