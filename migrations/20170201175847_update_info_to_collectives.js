const HOUSING_ID = '44444444-4444-4444-4444-444444444444';
const PAYDAY_LOANS_ID = '55555555-5555-5555-5555-555555555555';
const COURT_FINES_ID = '77777777-7777-7777-7777-777777777777';
const SOLIDARITY_BLOC_ID = '99999999-9999-9999-9999-999999999999';

exports.up = (knex, Promise) => Promise.all([
  knex('Collectives')
      .where('id', HOUSING_ID)
      .update({
        description: 'For anyone who went into debt for a place to live.',
      }),
  knex('Collectives')
      .where('id', PAYDAY_LOANS_ID)
      .update({
        description: 'For anybody in debt to a payday lender or check casher.',
      }),
  knex('Collectives')
      .where('id', COURT_FINES_ID)
      .update({
        description: 'For anyone who is in debt to a local court system or probation company.',
      }),
  knex('Collectives')
      .where('id', SOLIDARITY_BLOC_ID)
      .update({
        manifest: `We organize in solidarity with those who are struggling under the weight of indebtedness for simply trying to access basic needs like healthcare, education and housing.

We are committed to direct action, mutual aid and campaign support.`,
      }),
]);

exports.down = (knex, Promise) => Promise.resolve([]);
