const {
  discourse: { adminRole, apiKey, apiUsername, baseUrl },
} = require('$config/config');
const discourse = require('discourse-node-api')({
  api_key: apiKey,
  api_username: apiUsername,
  api_url: baseUrl,
});

/**
 * Maps a discourse user to have:
 *
 * 1) A stringified `externalId` property to make it easier to
 * compare to the external id stored in our database for the user
 * 2) A name property that is always populated, either with the
 * name sent from Discourse or else with the member's username
 * @param {Object} u The discourse user to map
 * @return {Object}
 */
discourse.mapUser = u => ({ ...u, externalId: u.id.toString(), name: u.name || u.username });

const mapGroupMembersAndOwners = ({ members, owners }) => ({
  members: members.map(discourse.mapUser),
  owners: owners.map(discourse.mapUser),
});

// TODO: cache this group for some amount of time
discourse.getDisputeAdmins = () =>
  discourse.groups.getMembers(adminRole).then(mapGroupMembersAndOwners);

discourse.getUser = ({ externalId }) => discourse.admin.users.getById(externalId);

discourse.getUserMapping = async ({ externalId }) =>
  discourse.mapUser(await discourse.getUser({ externalId }));

discourse.getUsers = async ({
  page = undefined,
  order = 'id',
  filter = null,
  showEmails = true,
  params = {},
} = {}) =>
  (await discourse.admin.users.search({
    page,
    order,
    filter,
    show_emails: showEmails,
    params,
  })).map(discourse.mapUser);

/**
 * @type {discourseApi.DiscourseApi}
 */
module.exports = discourse;
