const DisputeTemplate = require('../DisputeTemplate');
const { formatDate } = require('./shared/utils');

module.exports = {
  '11111111-1111-6666-1111-111111111111': {
    none: {
      private_student_loan_dispute_letter: {
        templates: [
          new DisputeTemplate({
            type: DisputeTemplate.RENDER_TYPE.PUG,
            file: ['private_student_loan_dispute_letter', '0.pug'],
            normalize({ forms: { 'personal-information-form': form } }) {
              return {
                user: {
                  name: form.name,
                  address1: form.address,
                  address2:
                    form.address2 ||
                    `${form.city}, ${form.state} ${form['zip-code']}`,
                },
                agency: {
                  name: form['firm-name'],
                  address: form['firm-address'],
                  address2:
                    form['firm-address2'] ||
                    `${form['firm-city']}, ${form['firm-state']}, ${
                      form['firm-zip-code']
                    }`,
                },
                accountNumber: form['account-number'],
                lastCorrespondence: formatDate(
                  form['last-correspondence-date'],
                ),
                date: formatDate(new Date()),
              };
            },
          }),
        ],
      },
    },
  },
};
