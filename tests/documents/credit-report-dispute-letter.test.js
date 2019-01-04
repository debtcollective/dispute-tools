const DisputeTool = require('../../models/DisputeTool');
const { render } = require('$services/render');

const { createUser, createDispute } = require('../utils');

describe('credit report dispute', () => {
  let dispute;

  before(async () => {
    dispute = await createDispute(
      await createUser(),
      await DisputeTool.findById('11111111-1111-4444-1111-111111111111'),
    );
    dispute.data = {
      forms: {
        'personal-information-form': {
          dob: '01-11-2019',
          ssn: '434-78-9070',
          city: 'San Francisco',
          name: 'Orlando Del Aguila',
          email: 'orlando@hashlabs.com',
          phone: '(555) 555-5555',
          state: 'California',
          address: '2443 Fillmore St Suite #380-4771',
          agencies: ['Experian', 'Equifax'],
          'zip-code': '94115',
          'debt-type': 'privateStudentLoanDebt',
          'debt-amount': '50000',
          currentCreditor: 'El creditor current',
          originalCreditor: 'El creditor original',
        },
      },
      option: 'none',
      signature: 'TDC',
    };
  });

  it('generates documents', async () => {
    const documents = await render(dispute);

    console.error(documents);
  });
});
