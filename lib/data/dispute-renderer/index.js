const path = require('path');

const {
  wageGarnishmentDocument,
  atbDocument,
  unauthorizedSignatureDocument,
  taxOffsetReviewDocument,
} = require(path.join(__dirname, '../dispute-tools/constants.js'));

module.exports = {
  '11111111-1111-1111-1111-111111111111': {
    A: {
      documents: {
        wage_garnishment: wageGarnishmentDocument,
      },
    },
    B: {
      documents: {
        wage_garnishment: wageGarnishmentDocument,
      },
    },
    C: {
      documents: {
        wage_garnishment: wageGarnishmentDocument,
        ability_to_benefit: atbDocument,
      },
    },
    D: {
      documents: {
        wage_garnishment: wageGarnishmentDocument,
        unauthorized_signature_form: unauthorizedSignatureDocument,
      },
    },
    E: {
      documents: {
        wage_garnishment: wageGarnishmentDocument,
      },
    },
  },
  '11111111-1111-2222-1111-111111111111': {
    A: {
      documents: {
        wage_garnishment: wageGarnishmentDocument,
        tax_offset_review: taxOffsetReviewDocument,
      },
    },
    B: {
      documents: {
        wage_garnishment: wageGarnishmentDocument,
        tax_offset_review: taxOffsetReviewDocument,
      },
    },
    C: {
      documents: {
        wage_garnishment: wageGarnishmentDocument,
        tax_offset_review: taxOffsetReviewDocument,
        ability_to_benefit: atbDocument,
      },
    },
    D: {
      documents: {
        wage_garnishment: wageGarnishmentDocument,
        tax_offset_review: taxOffsetReviewDocument,
        unauthorized_signature_form: unauthorizedSignatureDocument,
      },
    },
    E: {
      documents: {
        wage_garnishment: wageGarnishmentDocument,
        tax_offset_review: taxOffsetReviewDocument,
      },
    },
  },

  '11111111-1111-3333-1111-111111111111': {
    none: {
      documents: {
        general_dispute_letter: {
          templates: [
            {
              path: '/lib/assets/document_templates/general_debt_dispute_letter/0.png',
              fields: {
                'personal-information-form.name': {
                  x: 1508,
                  y: 380,
                },
                'personal-information-form.address1': {
                  x: 1508,
                  y: 484,
                },
                'personal-information-form.address2': {
                  x: 1508,
                  y: 546,
                },

                'personal-information-form.agency-name': {
                  x: 498,
                  y: 844,
                },
                'personal-information-form.agency-address': {
                  x: 1508,
                  y: 602,
                },

                letterOrPhone(template, data) {
                  const value = data.forms['personal-information-form']['letter-or-phonecall'];

                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(1024, 966, value);

                  const date = new Date();

                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(1302, 966,
                      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
                },

                'personal-information-form.state': {
                  x: 1360,
                  y: 1528,
                },

                signature(template, data) {
                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(380, 2536, data.signature);
                },
              },
            },
          ],
        },
      },
    },
  },

  '11111111-1111-4444-1111-111111111111': {
    none: {
      documents: {
        general_dispute_letter: {
          templates: [
            {
              path: '/lib/assets/document_templates/general_debt_dispute_letter/0.png',
              fields: {
                'personal-information-form.name': {
                  x: 500,
                  y: 600,
                },
                dob(template, data) {
                  const value = data.forms['personal-information-form'].dob;

                  const date = new Date(value);

                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(668, 1968,
                      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
                },
                'personal-information-form.ssn': {
                  x: 494,
                  y: 2078,
                },
                'personal-information-form.address': {
                  x: 578,
                  y: 2196,
                },
                'personal-information-form.address2': {
                  x: 578,
                  y: 2310,
                },

                'personal-information-form.phone': {
                  x: 516,
                  y: 2534,
                },

                signature(template, data) {
                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(380, 2536, data.signature);
                },
              },
            },
          ],
        },
        agencies: {
          templates: [
            {
              path: '/lib/assets/document_templates/blank/0.png',
              fields: {
                agencies(template, data) {
                  const value = data.forms['personal-information-form'].agencies;

                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(162, 230, value);
                },
              },
            },
          ],
        },
      },
    },
  },

  '11111111-1111-6666-1111-111111111111': {
    none: {
      documents: {
        private_student_loan_dispute_letter: {
          templates: [
            {
              path: '/lib/assets/document_templates/private_student_load_dispute_letter/0.png',
              fields: {
                'personal-information-form.name': {
                  x: 1420,
                  y: 236,
                },
                'personal-information-form.address': {
                  x: 1420,
                  y: 294,
                },
                'personal-information-form.address2': {
                  x: 1420,
                  y: 348,
                },
                'personal-information-form.firm-address': {
                  x: 1420,
                  y: 404,
                },
                date(template) {
                  const date = new Date();

                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(1420, 452,
                      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
                },

                'personal-information-form.firm-name': {
                  x: 494,
                  y: 352,
                },
                'personal-information-form.account-number': {
                  x: 1272,
                  y: 476,
                },
                'personal-information-form.last-correspondence-date': {
                  x: 1272,
                  y: 538,
                },

                signature(template, data) {
                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(372, 2726, data.signature);
                },
              },
            },
          ],
        },
      },
    },
  },
};
