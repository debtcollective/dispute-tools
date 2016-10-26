exports.seed = (knex) => {
  const uuid = require('uuid');

  return knex('Collectives').del()
    .then(() => {
      const collectives = [
        {
          id: '11111111-1111-1111-1111-111111111111',
          name: 'For-Profit College Collective',
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          name: 'Student Debt Collective',
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          name: 'Credit Card Debt Collective',
        },
        {
          id: '44444444-4444-4444-4444-444444444444',
          name: 'Mortgage Debt Collective',
        },
        {
          id: '55555555-5555-5555-5555-555555555555',
          name: 'Payday Loans Collective',
        },
        {
          id: '66666666-6666-6666-6666-666666666666',
          name: 'Auto Loans Collective',
        },
        {
          id: '77777777-7777-7777-7777-777777777777',
          name: 'Court Fines and Fees Collective',
        },
        {
          id: '88888888-8888-8888-8888-888888888888',
          name: 'Medical Debt Collective',
        },
        {
          id: '99999999-9999-9999-9999-999999999999',
          name: 'Solidarity Bloc',
        },
      ];

      return knex('Collectives').insert(collectives.map((collective) => {
        return {
          id: collective.id,
          name: collective.name,
          created_at: new Date(),
          updated_at: new Date(),
        };
      }));
    });
};
