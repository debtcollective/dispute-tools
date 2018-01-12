const uuid = require('uuid');

exports.seed = knex => {
  const topics = [
    'Know Your Rights',
    'Know Your Debt',
    'Wall Street',
    'Lenders and Servicers',
    'Art and Design',
    'Social Media',
    'Debt Disputes',
    'Schools',
    'Actions',
    'Hospitals',
    'Collection Agencies',
    'Politics',
    'Organizing',
  ];

  return knex('Topics')
    .del()
    .then(() =>
      knex('Topics').insert(
        topics.map(topic => ({
          id: uuid.v4(),
          title: topic,
          created_at: new Date(),
          updated_at: new Date(),
        })),
      ),
    );
};
