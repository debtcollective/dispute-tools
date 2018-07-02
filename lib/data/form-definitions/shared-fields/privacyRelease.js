const Field = require('../validations');

module.exports = new Field({
  title: 'Department of Education Privacy Release',
  fields: [
    [
      new Field({
        name: 'doe-privacy-release',
        label:
          'Would you like to authorize the Debt Collective to speak to the Department of Education and its agents about your case?',
        type: 'yesno',
        confirm: {
          no: {
            message:
              "Are you sure you don't want to authorize the Debt Collective to advocate directly on your behalf?",
            okButtonText: 'Yes, I am sure I do not want to authorize this',
            cancelButtonText: 'No, change my answer to allow the Debt Collective to do so',
          },
        },
      }),
    ],
  ],
});
