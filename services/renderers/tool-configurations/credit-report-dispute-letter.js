const DisputeTemplate = require('$services/renderers/DisputeTemplate');
const { getAddress2 } = require('./shared/utils');

module.exports = {
  '11111111-1111-4444-1111-111111111111': {
    none: {
      credit_report_dispute_letter: {
        templates: [
          new DisputeTemplate({
            type: DisputeTemplate.RENDER_TYPE.PUG,
            file: ['credit_report_dispute_letter', '0.pug'],
            normalize({ forms: { 'personal-information-form': form } }) {
              return {
                dob: form.dob,
                ssn: form.ssn,
                address: form.address,
                address2: getAddress2({ form }),
                email: form.email,
                phone: form.phone,
                name: form.name,
              };
            },
          }),
          new DisputeTemplate({
            type: DisputeTemplate.RENDER_TYPE.PUG,
            file: ['credit_report_dispute_letter', '1.pug'],
            data: {
              // prettier-ignore
              Experian: [
                'Experian',
                'National Consumer Assistance Center',
                'P.O. Box 2002',
                'Allen, TX 75013',
              ],
              // prettier-ignore
              Equifax: [
                'Equifax Credit Information Services, Inc.',
                'P.O. Box 740241',
                'Atlanta, GA 30374',
              ],
              // prettier-ignore
              TransUnion: [
                'TransUnion LLC',
                'Consumer Disclosure Center',
                'P.O. Box 1000',
                'Chester, PA 19022',
              ] // eslint-disable-line
            },
            normalize({
              forms: {
                'personal-information-form': { agencies },
              },
            }) {
              if (!Array.isArray(agencies)) {
                agencies = [agencies];
              }

              return {
                agencies: agencies.map(agency => this.data[agency]),
              };
            },
          }),
        ],
      },
    },
  },
};
