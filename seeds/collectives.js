exports.seed = (knex) => {
  const uuid = require('uuid');

  return knex('Collectives').del()
    .then(() => {
      const collectives = [
        'For-Profit College Collective',
        'Student Debt Collective',
        'Credit Card Debt Collective',
        'Mortgage Debt Collective',
        'Payday Loans Collective',
        'Auto Loans Collective',
        'Court Fines and Fees Collective',
        'Medical Debt Collective',
        'Solidarity Bloc',
      ];

      return knex('Collectives').insert(collectives.map((collective) => {
        return {
          id: uuid.v4(),
          name: collective,
          created_at: new Date(),
          updated_at: new Date(),
        };
      }));
    });
};
