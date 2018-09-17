const DisputeTemplate = require('$services/renderers/DisputeTemplate');
const { getAddress2 } = require('./shared/utils');

module.exports = {
  '11111111-1111-3333-1111-111111111111': {
    none: {
      general_dispute_letter: {
        templates: [
          new DisputeTemplate({
            type: DisputeTemplate.RENDER_TYPE.PUG,
            file: ['general_debt_dispute_letter', '0.pug'],
            normalize({ forms: { 'personal-information-form': form } }) {
              return {
                user: {
                  name: form.name,
                  address1: form.address,
                  address2: getAddress2({ form }),
                },
                agency: {
                  name: form['agency-name'],
                  address1: form['agency-address1'] || form['agency-address'],
                  address2: getAddress2({ form, prefix: 'agency-' }),
                },
              };
            },
          }),
        ],
      },
    },
  },
};
