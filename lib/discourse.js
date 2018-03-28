const { discourse: { apiKey, apiUsername, baseUrl } } = require('../config/config');
const discourse = require('discourse-node-api')({
  api_key: apiKey,
  api_username: apiUsername,
  api_url: baseUrl,
});

/**
 * @type {discourseApi.DiscourseApi}
 */
module.exports = discourse;
