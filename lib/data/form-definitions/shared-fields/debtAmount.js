const Field = require('../validations');

const { currency, text } = Field.FieldValidation;

exports.group = {
  title: 'Amount of Debt Disputed',
  subtitle: `Please provide the amount of debt collectors claim you owe. This will help us better understand the types of debt you and our members are fighting.
<br><br>
If you don't see your type of debt, choose "Other" and enter the debt type.`,
  fields: [
    [
      new Field({
        type: 'mountable',
        valueType: 'number',
        name: 'debt-amounts-mount-point',
        fields: [
          [
            new Field({
              name: 'debt-type',
              label: 'Debt type',
              validations: text,
            }),
            new Field({
              name: 'debt-amount',
              label: 'Debt amount',
              validations: currency,
            }),
          ],
        ],
      }),
    ],
  ],
};

exports.field = new Field({
  type: 'mountable',
  name: 'debt-amount-mount-point',
  label: 'Amount of Disputed Debt',
  validations: currency,
  fields: [
    [
      new Field({
        name: 'debt-amount',
        label: 'Debt amount',
        validations: currency,
      }),
    ],
  ],
});
