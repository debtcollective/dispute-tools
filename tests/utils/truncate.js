const Promise = require('bluebird');
const _ = require('lodash');

module.exports = models => {
  if (!_.isArray(models)) {
    models = [models];
  }

  return Promise.each(models, model =>
    model.knex().raw(`truncate table "${model.tableName}" cascade`),
  );
};
