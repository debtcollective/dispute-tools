const Field = require('../validations');

const { US_STATES } = Field;
const { zip, text, date, phone, usStates } = Field.FieldValidation;

module.exports = () =>
  new Field({
    title: 'Employment',
    yesno: true,
    name: 'employment-radio-option',
    label: 'Are You Currently employed?',

    fields: [
      [
        new Field({
          name: 'employer',
          label: 'Current Employer',
          columnClassName: 'md-col-8',
          validations: text,
        }),
        new Field({
          name: 'employmentDate',
          type: 'date',
          label: 'Beginning Date',
          validations: date,
          columnClassName: 'md-col-4',
        }),
      ],
      [
        new Field({
          name: 'employerAddress1',
          label: 'Employer Mailing Address 1',
          validations: text,
        }),
      ],
      [
        new Field({
          name: 'employerCity',
          label: 'Employer City',
          columnClassName: 'md-col-4',
          validations: text,
        }),
        new Field({
          name: 'employerState',
          label: 'Employer State',
          columnClassName: 'md-col-4',
          type: 'dropdown',
          options: US_STATES,
          validations: usStates,
        }),
        new Field({
          name: 'employerZipCode',
          label: 'Employer Zip Code',
          columnClassName: 'md-col-4',
          validations: zip,
        }),
      ],
      [
        new Field({
          name: 'employerPhone',
          label: 'Employer Phone',
          validations: phone,
        }),
      ],
    ],
  });
