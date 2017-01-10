const uuid = require('uuid');

exports.seed = (knex) => {
  const topics = [
    'Politics',
    'Wall Street',
    'Lenders and Servicers',
    'Know Your Rights',
    'Know Your Debt',
    'Debt Disputes',
    'Schools',
    'Hospitals',
    'Collection Agencies',
    'Media',
    'Education',
    'Organizing',
    'Call',
    'Poll',
    'Event',
    'Meeting',
    'Action',
  ];

  return knex('KBTopics').del()
    .then(() => {
      return knex('KBTopics').insert(
        topics.map((topic) => {
          return {
            id: uuid.v4(),
            title: topic,
            created_at: new Date(),
            updated_at: new Date(),
          };
        })
      );
    });
};
