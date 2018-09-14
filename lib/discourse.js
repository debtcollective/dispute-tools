const {
  discourse: { adminRole, coordinatorRole, apiKey, apiUsername, baseUrl },
} = require('../config/config');
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

/**
 * TODO: cache these groups for some amount of time
 * they should not change very often and when they do
 * it'll probably be okay to have to wait some number
 * of hours before refreshing them. As it stands we will
 * end up calling `getDisputeCoordinators` and hitting
 * discourse twice every time a dispute is created, once to
 * get the group and then a second time to send the message
 */

discourse.getDisputeAdmins = () =>
  discourse.groups.getMembers(adminRole).then(mapGroupMembersAndOwners);

discourse.getDisputeCoordinators = () =>
  discourse.groups.getMembers(coordinatorRole).then(mapGroupMembersAndOwners);

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
