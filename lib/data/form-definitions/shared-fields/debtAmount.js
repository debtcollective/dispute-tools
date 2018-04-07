const Field = require('../validations');

const { currency } = Field.FieldValidation;

exports.group = {
  title: 'Debt Amounts',
  subtitle: `Please provide the amounts of debt that collectors claim you owe, to help us better understand the types of debt you and our members are fighting.
<br><br>
If you don't see your type of debt, choose "Other" and enter the debt type.`,
  fields: [
    [
      new Field({
        type: 'mountable',
        valueType: 'number',
        name: 'debt-amounts-mount-point',
      }),
    ],
  ],
};

exports.field = new Field({
  name: 'debt-amount',
  label: 'Amount of Disputed Debt',
  validations: currency,
});
