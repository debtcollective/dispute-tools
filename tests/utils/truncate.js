'use strict';

var _ = require('lodash');

module.exports = (models) => {
  if (!_.isArray(models)) {
    models = [models];
  }

  return Promise.each(models, function (model) {
    return model.knex().raw('truncate table "' + model.tableName + '" cascade');
  });
};
