const DisputeTemplate = require('../DisputeTemplate');
const { formatDate, getAddress2 } = require('./shared/utils');

module.exports = {
  '11111111-1111-6666-1111-111111111111': {
    none: {
      private_student_loan_dispute_letter: {
        templates: [
          new DisputeTemplate({
            type: DisputeTemplate.RENDER_TYPE.PUG,
            file({ forms: { 'personal-information-form': { 'is-debt-in-default': inDefault } } }) {
              return [
                'private_student_loan_dispute_letter',
                inDefault === 'yes' ? 'defaulted.pug' : 'non-defaulted.pug',
              ];
            },
            normalize({ forms: { 'personal-information-form': form } }) {
              return {
                user: {
                  name: form.name,
                  address1: form.address,
                  address2: getAddress2({ form }),
                },
                agency: {
                  name: form['firm-name'],
                  address1: form['firm-address'],
                  address2: getAddress2({ form, prefix: 'firm-' }),
                },
                accountNumber: form['account-number'],
                lastCorrespondence: formatDate(form['last-correspondence-date']),
                date: formatDate(new Date()),
              };
            },
          }),
        ],
      },
    },
  },
};
