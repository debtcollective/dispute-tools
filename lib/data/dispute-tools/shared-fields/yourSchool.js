const Field = require('../validations');

const { US_STATES } = Field;
const { zip, text, date } = Field.FieldValidation;

module.exports = () => ({
  title: 'Your School',
  fields: [
    [
      new Field({
        name: 'schoolName',
        label: 'Name of the school where you incurred the debt',
        columnClassName: 'md-col-12',
        validations: text,
      }),
    ],
    [
      new Field({
        name: 'school-address',
        label: 'School Mailing Address',
        validations: text,
      }),
    ],
    [
      new Field({
        name: 'school-city',
        label: 'School City',
        columnClassName: 'md-col-5',
        validations: text,
      }),
      new Field({
        name: 'school-state',
        label: 'School State',
        columnClassName: 'md-col-4',
        type: 'dropdown',
        options: US_STATES,
      }),
      new Field({
        name: 'school-zip-code',
        label: 'School Zip Code',
        columnClassName: 'md-col-3',
        validations: zip,
      }),
    ],
    [
      {
        subtitle: 'When did you attend the school?',
        type: 'group',
        fields: [
          [
            new Field({
              name: 'school-attended-from',
              label: 'From',
              columnClassName: 'md-col-6',
              type: 'date',
              validations: date,
            }),
            new Field({
              name: 'school-attended-to',
              label: 'To',
              columnClassName: 'md-col-6',
              type: 'date',
              validations: date,
            }),
          ],
        ],
      },
    ],
  ],
});
