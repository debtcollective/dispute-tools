/* eslint-disable max-len */

exports.seed = (knex) => {
  return knex('Collectives').del()
    .then(() => {
      const collectives = [
        {
          id: '11111111-1111-1111-1111-111111111111',
          name: 'For-Profit Colleges Collective',
          description: 'For anyone who is in debt after attending a for-profit college.',
          manifest: `### We are former for-profit college students who have joined with others in our situation to fight back against predatory creditors and the federal government.

We fight because it is wrong that 40 percent of people in debt use credit cards to cover basic living costs including rent, food, and utilities. It is wrong that 62 percent of personal bankruptcies in the U.S. are linked to medical debt. It is wrong that students are leaving college owing an average of $35,000, and millions are in default. It is wrong that payday lenders earn high profits from poverty. And it is wrong that local court systems target poor people, disproportionately black and brown, and load them up with debt.

We are different in many ways. Some of us are old, and some are young; we are from different parts of the country; we are diverse in race, ethnicity and religious background. A common belief unites us: everyone should have access to the goods and services they need to live without going broke or going into debt.

Debt has isolated us and made us feel alone and ashamed. We have come out of the shadows to fight back as individuals and as a collective. We are here because we are organizing to win debt relief and a better economic system for all.`,
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          name: 'Student Debt Collective',
          description: 'For anyone who has student loans.',
          manifest: `### We are student debtors who have joined with others in our situation to fight back against predatory creditors and the federal government.

We fight because it is wrong that 40 percent of people in debt use credit cards to cover basic living costs including rent, food, and utilities. It is wrong that 62 percent of personal bankruptcies in the U.S. are linked to medical debt. It is wrong that students are leaving college owing an average of $35,000, and millions are in default. It is wrong that payday lenders earn high profits from poverty. And it is wrong that local court systems target poor people, disproportionately black and brown, and load them up with debt.

We are different in many ways. Some of us are old, and some are young; we are from different parts of the country; we are diverse in race, ethnicity and religious background. A common belief unites us: everyone should have access to the goods and services they need to live without going broke or going into debt.

Debt has isolated us and made us feel alone and ashamed. We have come out of the shadows to fight back as individuals and as a collective. We are here because we are organizing to win debt relief and a better economic system for all.`,
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          name: 'Credit Card Debt Collective',
          description: 'For anyone who has credit card debt.',
          manifest: `### We are working together to plan actions, to develop debt resistance campaigns and to launch coordinated strikes.

We fight because it is wrong that 40 percent of people in debt use credit cards to cover basic living costs including rent, food, and utilities. It is wrong that 62 percent of personal bankruptcies in the U.S. are linked to medical debt. It is wrong that students are leaving college owing an average of $35,000, and millions are in default. It is wrong that payday lenders earn high profits from poverty. And it is wrong that local court systems target poor people, disproportionately black and brown, and load them up with debt.

We are different in many ways. Some of us are old, and some are young; we are from different parts of the country; we are diverse in race, ethnicity and religious background. A common belief unites us: everyone should have access to the goods and services they need to live without going broke or going into debt.

Debt has isolated us and made us feel alone and ashamed. We have come out of the shadows to fight back as individuals and as a collective. We are here because we are organizing to win debt relief and a better economic system for all.`,
        },
        {
          id: '44444444-4444-4444-4444-444444444444',
          name: 'Housing Debt Collective',
          description: 'For anyone who went into debt for a place to live.',
          manifest: `### We are working together to plan actions, to develop debt resistance campaigns and to launch coordinated strikes.

We fight because it is wrong that 40 percent of people in debt use credit cards to cover basic living costs including rent, food, and utilities. It is wrong that 62 percent of personal bankruptcies in the U.S. are linked to medical debt. It is wrong that students are leaving college owing an average of $35,000, and millions are in default. It is wrong that payday lenders earn high profits from poverty. And it is wrong that local court systems target poor people, disproportionately black and brown, and load them up with debt.

We are different in many ways. Some of us are old, and some are young; we are from different parts of the country; we are diverse in race, ethnicity and religious background. A common belief unites us: everyone should have access to the goods and services they need to live without going broke or going into debt.

Debt has isolated us and made us feel alone and ashamed. We have come out of the shadows to fight back as individuals and as a collective. We are here because we are organizing to win debt relief and a better economic system for all.`,
        },
        {
          id: '55555555-5555-5555-5555-555555555555',
          name: 'Payday Loans Collective',
          description: 'For anybody in debt to a payday lender or check casher.',
          manifest: `### We are working together to plan actions, to develop debt resistance campaigns and to launch coordinated strikes.

We fight because it is wrong that 40 percent of people in debt use credit cards to cover basic living costs including rent, food, and utilities. It is wrong that 62 percent of personal bankruptcies in the U.S. are linked to medical debt. It is wrong that students are leaving college owing an average of $35,000, and millions are in default. It is wrong that payday lenders earn high profits from poverty. And it is wrong that local court systems target poor people, disproportionately black and brown, and load them up with debt.

We are different in many ways. Some of us are old, and some are young; we are from different parts of the country; we are diverse in race, ethnicity and religious background. A common belief unites us: everyone should have access to the goods and services they need to live without going broke or going into debt.

Debt has isolated us and made us feel alone and ashamed. We have come out of the shadows to fight back as individuals and as a collective. We are here because we are organizing to win debt relief and a better economic system for all.`,
        },
        {
          id: '66666666-6666-6666-6666-666666666666',
          name: 'Auto Loans Collective',
          description: 'For anyone who went into debt to buy a car.',
          manifest: `### We are working together to plan actions, to develop debt resistance campaigns and to launch coordinated strikes.

We fight because it is wrong that 40 percent of people in debt use credit cards to cover basic living costs including rent, food, and utilities. It is wrong that 62 percent of personal bankruptcies in the U.S. are linked to medical debt. It is wrong that students are leaving college owing an average of $35,000, and millions are in default. It is wrong that payday lenders earn high profits from poverty. And it is wrong that local court systems target poor people, disproportionately black and brown, and load them up with debt.

We are different in many ways. Some of us are old, and some are young; we are from different parts of the country; we are diverse in race, ethnicity and religious background. A common belief unites us: everyone should have access to the goods and services they need to live without going broke or going into debt.

Debt has isolated us and made us feel alone and ashamed. We have come out of the shadows to fight back as individuals and as a collective. We are here because we are organizing to win debt relief and a better economic system for all.`,
        },
        {
          id: '77777777-7777-7777-7777-777777777777',
          name: 'Court Fines and Fees Collective',
          description: 'For anyone who is in debt to a local court system or probation company.',
          manifest: `### We are working together to plan actions, to develop debt resistance campaigns and to launch coordinated strikes.

We fight because it is wrong that 40 percent of people in debt use credit cards to cover basic living costs including rent, food, and utilities. It is wrong that 62 percent of personal bankruptcies in the U.S. are linked to medical debt. It is wrong that students are leaving college owing an average of $35,000, and millions are in default. It is wrong that payday lenders earn high profits from poverty. And it is wrong that local court systems target poor people, disproportionately black and brown, and load them up with debt.

We are different in many ways. Some of us are old, and some are young; we are from different parts of the country; we are diverse in race, ethnicity and religious background. A common belief unites us: everyone should have access to the goods and services they need to live without going broke or going into debt.

Debt has isolated us and made us feel alone and ashamed. We have come out of the shadows to fight back as individuals and as a collective. We are here because we are organizing to win debt relief and a better economic system for all.`,
        },
        {
          id: '88888888-8888-8888-8888-888888888888',
          name: 'Medical Debt Collective',
          description: 'For anyone who went into debt for health care.',
          manifest: `### We are working together to plan actions, to develop debt resistance campaigns and to launch coordinated strikes.

We fight because it is wrong that 40 percent of people in debt use credit cards to cover basic living costs including rent, food, and utilities. It is wrong that 62 percent of personal bankruptcies in the U.S. are linked to medical debt. It is wrong that students are leaving college owing an average of $35,000, and millions are in default. It is wrong that payday lenders earn high profits from poverty. And it is wrong that local court systems target poor people, disproportionately black and brown, and load them up with debt.

We are different in many ways. Some of us are old, and some are young; we are from different parts of the country; we are diverse in race, ethnicity and religious background. A common belief unites us: everyone should have access to the goods and services they need to live without going broke or going into debt.

Debt has isolated us and made us feel alone and ashamed. We have come out of the shadows to fight back as individuals and as a collective. We are here because we are organizing to win debt relief and a better economic system for all.`,
        },
        {
          id: '99999999-9999-9999-9999-999999999999',
          name: 'Solidarity Bloc',
          description: 'For anyone organizing in solidarity with people in debt.',
          manifest: `We organize in solidarity with those who are struggling under the weight of indebtedness for simply trying to access basic needs like healthcare, education and housing.

We are committed to direct action, mutual aid and campaign support.`,
        },
      ];

      return knex('Collectives').insert(collectives.map((collective) => {
        return Object.assign(collective, {
          created_at: new Date(),
          updated_at: new Date(),
        });
      }));
    });
};
