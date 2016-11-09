/* globals Campaign, Collective */

Campaign.relations = {
  collective: {
    type: 'HasOne',
    relatedModel: Collective,
    ownerCol: 'collective_id',
    relatedCol: 'id',
  },
};
