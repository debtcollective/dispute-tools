const Field = require('../validations');
const { field: debtAmount } = require('./debtAmount');

const { US_STATES } = Field;
const { zip, email, ssn, phone, text, date } = Field.FieldValidation;

module.exports = () => ({
  title: 'Personal Information',
  subtitle: 'Let’s get started',
  fields: [
    [debtAmount],
    [
      new Field({
        name: 'name',
        label: 'Your Name',
        columnClassName: 'md-col-8',
        validations: text,
      }),
      new Field({
        name: 'ssn',
        label: 'Social Security Number',
        columnClassName: 'md-col-4',
        validations: ssn,
      }),
    ],
    [
      new Field({
        name: 'address1',
        label: 'Your Mailing Address',
        validations: text,
      }),
    ],
    [
      new Field({
        name: 'city',
        label: 'Your City',
        columnClassName: 'md-col-5',
        validations: text,
      }),
      new Field({
        name: 'state',
        label: 'Your State',
        columnClassName: 'md-col-4',
        type: 'dropdown',
        options: US_STATES,
        validations: [`oneOf:${US_STATES.join(', ')}:false`],
      }),
      new Field({
        name: 'zip-code',
        label: 'Your Zip Code',
        columnClassName: 'md-col-3',
        validations: zip,
      }),
    ],
    [
      new Field({
        name: 'dob',
        label: 'Date of birth',
        type: 'date',
        columnClassName: 'md-col-6',
        validations: date,
      }),
      new Field({
        name: 'email',
        label: 'Your email',
        columnClassName: 'md-col-6',
        validations: email,
      }),
    ],
    [
      new Field({
        name: 'phone',
        label: 'Your telephone',
        columnClassName: 'md-col-6',
        validations: phone,
      }),
      new Field({
        name: 'phone2',
        label: 'Your telephone (alt.)',
        columnClassName: 'md-col-6',
        validations: phone,
        required: false,
      }),
    ],
  ],
});
