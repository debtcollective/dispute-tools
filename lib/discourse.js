const { discourse: { apiKey, apiUsername, baseUrl } } = require('../config/config');
const discourse = require('discourse-node-api')({
  api_key: apiKey,
  api_username: apiUsername,
  api_url: baseUrl,
});

discourse.mapUser = u => ({ ...u, externalId: u.id.toString() });

discourse.getDisputeAdmins = () =>
  discourse.groups.getMembers('dispute-admin').then(({ members, owners }) => ({
    members: members.map(discourse.mapUser),
    owners: owners.map(discourse.mapUser),
  }));

discourse.getUser = ({ externalId }) => discourse.admin.users.getById(externalId);

/**
 * @type {discourseApi.DiscourseApi}
 */
module.exports = discourse;
