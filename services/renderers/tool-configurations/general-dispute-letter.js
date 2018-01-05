const DisputeTemplate = require('../DisputeTemplate');

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
                  address2: `${form.city}, ${form.state} ${form['zip-code']}`,
                },
                agency: {
                  name: form['agency-name'],
                  address1: form['agency-address1'] || form['agency-address'],
                  address2:
                    form['agency-address2'] // Retain the old agency address format
                    || `${form['agency-city']}, ${form['agency-state']} ${form['agency-zip-code']}`,
                },
                contactType: form['letter-or-phonecall'],
              };
            },
          }),
        ],
      },
    },
  },
};
