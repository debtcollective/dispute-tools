
exports.seed = (knex) => {
  return knex('Campaigns').del()
    .then(() => {
      const defaultCover = x =>
        `${process.env.NODE_ENV || 'development'}/badges/${x}/cover/{version}.{ext}`;

      const defaultMeta = x =>
        require(`../public/images/badges/${x}/data.json`);

      const defaultTitle = x => `${x} Feed`;
      const defaultIntro = x => `This is a space for general posts about ${x}`;
      const defaultDescription = x => `This is a space for general posts about ${x}`;

      const campaigns = [
        {
          collective_id: '11111111-1111-1111-1111-111111111111',
          id: '10101010-1010-1010-1010-101010101010',
          default: true,
          title: defaultTitle('For-Profit Colleges'),
          intro_text: defaultIntro('for-profit colleges'),
          description: defaultDescription('for-profit colleges'),
          active: true,
          published: true,
          cover_path: defaultCover('diamond'),
          cover_meta: defaultMeta('diamond'),
        },
        {
          collective_id: '22222222-2222-2222-2222-222222222222',
          id: '20202020-2020-2020-2020-202020202020',
          default: true,
          title: defaultTitle('Student Debt'),
          intro_text: defaultIntro('student debt'),
          description: defaultDescription('student'),
          active: true,
          published: true,
          cover_path: defaultCover('triangle-up'),
          cover_meta: defaultMeta('triangle-up'),
        },
        {
          collective_id: '33333333-3333-3333-3333-333333333333',
          id: '30303030-3030-3030-3030-303030303030',
          default: true,
          title: defaultTitle('Credit Card Debt'),
          intro_text: defaultIntro('credit card debt'),
          description: defaultDescription('credit card'),
          active: true,
          published: true,
          cover_path: defaultCover('pentagon-up'),
          cover_meta: defaultMeta('pentagon-up'),
        },
        {
          collective_id: '44444444-4444-4444-4444-444444444444',
          id: '40404040-4040-4040-4040-404040404040',
          default: true,
          title: defaultTitle('Housing Debt'),
          intro_text: defaultIntro('housing debt'),
          description: defaultDescription('housing'),
          active: true,
          published: true,
          cover_path: defaultCover('hexagon'),
          cover_meta: defaultMeta('hexagon'),
        },
        {
          collective_id: '55555555-5555-5555-5555-555555555555',
          id: '50505050-5050-5050-5050-505050505050',
          default: true,
          title: defaultTitle('Payday Loans'),
          intro_text: defaultIntro('payday loans'),
          description: defaultDescription('payday loans'),
          active: true,
          published: true,
          cover_path: defaultCover('diamond'),
          cover_meta: defaultMeta('diamond'),
        },
        {
          collective_id: '66666666-6666-6666-6666-666666666666',
          id: '60606060-6060-6060-6060-606060606060',
          default: true,
          title: defaultTitle('Auto Loans'),
          intro_text: defaultIntro('auto loans'),
          description: defaultDescription('auto loans'),
          active: true,
          published: true,
          cover_path: defaultCover('triangle-down'),
          cover_meta: defaultMeta('triangle-down'),
        },
        {
          collective_id: '77777777-7777-7777-7777-777777777777',
          id: '70707070-7070-7070-7070-707070707070',
          default: true,
          title: defaultTitle('Court Fines and Fees'),
          intro_text: defaultIntro('court fines and fees'),
          description: defaultDescription('court fines and fees'),
          active: true,
          published: true,
          cover_path: defaultCover('pentagon-up'),
          cover_meta: defaultMeta('pentagon-up'),
        },
        {
          collective_id: '88888888-8888-8888-8888-888888888888',
          id: '80808080-8080-8080-8080-808080808080',
          default: true,
          title: defaultTitle('Medical Debt'),
          intro_text: defaultIntro('medical debt'),
          description: defaultDescription('medical'),
          active: true,
          published: true,
          cover_path: defaultCover('triangle-down'),
          cover_meta: defaultMeta('triangle-down'),
        },
        {
          collective_id: '99999999-9999-9999-9999-999999999999',
          id: '90909090-9090-9090-9090-909090909090',
          default: true,
          title: defaultTitle('Solidarity Bloc'),
          intro_text: defaultIntro('solidarity bloc'),
          description: defaultDescription('solidarity bloc'),
          active: true,
          published: true,
          cover_path: defaultCover('solidarity-bloc'),
          cover_meta: defaultMeta('solidarity-bloc'),
        },
      ];

      return knex('Campaigns').insert(campaigns.map((campaign) => {
        return Object.assign(campaign, {
          created_at: new Date(),
          updated_at: new Date(),
        });
      }));
    });
};
