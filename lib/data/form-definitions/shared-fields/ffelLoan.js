const Field = require('../validations');

const { US_STATES } = Field;
const { zip, text, usStates } = Field.FieldValidation;

module.exports = () =>
  new Field({
    title: 'FFEL Loan',
    yesno: true,
    name: 'ffel-loan-radio-option',
    label: 'Are you a FFEL holder?',
    // eslint-disable-next-line quotes
    caption: `If you have a FFEL loan, add the name and address of your guaranty agency in the box below. The name and address may appear on the tax offset notice you received in the mail. If you don't know the name and address of your guarantor, you can contact the Department of Education or call <span class="-text-0">1-800-304-3107</span> and ask for this information.`,
    fields: [
      [
        new Field({
          name: 'guarantyAgency',
          label: 'Name of Guaranty Agency',
          validations: text,
        }),
      ],
      [
        new Field({
          name: 'guarantyAgencyMailingAddress',
          label: 'Guaranty Agency mailing address',
          validations: text,
        }),
      ],
      [
        new Field({
          name: 'guarantyAgencyCity',
          label: 'Guaranty Agency City',
          columnClassName: 'md-col-4',
          validations: text,
        }),
        new Field({
          name: 'guarantyAgencyState',
          label: 'Guaranty Agency State',
          columnClassName: 'md-col-4',
          type: 'dropdown',
          options: US_STATES,
          validations: usStates,
        }),
        new Field({
          name: 'guarantyAgencyZipCode',
          label: 'Guaranty Agency Zip Code',
          columnClassName: 'md-col-4',
          validations: zip,
        }),
      ],
    ],
  });
