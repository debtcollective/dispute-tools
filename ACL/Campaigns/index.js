/* global Campaign */

const isPublicCampaign = req =>
  Campaign.query()
    .where('id', req.params.id)
    .then(([result]) => result.published);

module.exports = {
  Visitor: [['show', isPublicCampaign], ['join', false]],
  User: [['show', 'join', isPublicCampaign]],
  CollectiveManager: [['show', 'join', true]],
  Admin: [['show', 'join', true]],
};
