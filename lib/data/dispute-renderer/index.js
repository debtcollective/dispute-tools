module.exports = {
  '11111111-1111-1111-1111-111111111111': {
    'A': {
      documents: {
        wage_garnishment: {
          templates: [
            {
              path: '/lib/assets/document_templates/wage_garnishment/0.png',

              fields: {
                'personal-information-form.name': {
                  x: 522,
                  y: 500,
                },
                'personal-information-form.ssn': {
                  x: 1862,
                  y: 500,
                },
                'personal-information-form.address1': {
                  x: 522,
                  y: 572,
                },
                'personal-information-form.address2': {
                  x: 522,
                  y: 644,
                },
                'personal-information-form.phone': {
                  x: 522,
                  y: 716,
                },
                'personal-information-form.employer': {
                  x: 522,
                  y: 784,
                },
                'personal-information-form.employerAddress1': {
                  x: 680,
                  y: 858,
                },
                'personal-information-form.employerAddress2': {
                  x: 680,
                  y: 932,
                },
                'personal-information-form.employerPhone': {
                  x: 680,
                  y: 1004,
                },
                'personal-information-form.employmentDate': {
                  x: 1170,
                  y: 1076,
                },
                process(template, data) {
                  const w = 295;
                  let h;

                  const option = parseInt(data.disputeProcess, 10);

                  switch (option) {
                    case 1:
                      h = 2250;
                      break;
                    case 2:
                      h = 2390;
                      break;
                    case 3:
                      h = 2720;
                      break;
                    default:
                      break;
                  }

                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(w, h, 'P');

                  if (option === 2 && data.disputeProcessCity) {
                    const _y = 2558;
                    let _x;

                    switch (data.disputeProcessCity) {
                      case 'Atlanta':
                        _x = 1176;
                        break;
                      case 'Chicago':
                        _x = 1518;
                        break;
                      case 'San Francisco':
                        _x = 1858;
                        break;
                      default:
                        break;
                    }

                    template
                      .font('Arial')
                      .fontSize(38)
                      .drawText(_x, _y, data.forms['personal-information-form'].phone);
                  }
                },
              },
            },
            {
              path: '/lib/assets/document_templates/wage_garnishment/1.png',
              fields: {},
            },
            {
              path: '/lib/assets/document_templates/wage_garnishment/2.png',
              fields: {
                date(template) {
                  const date = new Date();

                  template
                    .font('Arial')
                    .fontSize(38)
                    .drawText(440, 2354,
                      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
                },
                signature(template, data) {
                  template
                    .font('Arial')
                    .fontSize(38)
                    .drawText(982, 2354, data.signature);
                },
              },
            },
            {
              path: '/lib/assets/document_templates/wage_garnishment/3.png',
              fields: {},
            },
            {
              path: '/lib/assets/document_templates/wage_garnishment/4.png',
              fields: {},
            },
            {
              path: '/lib/assets/document_templates/wage_garnishment/5.png',
              fields: {},
            },
          ],
        },
      },
    },
  },
};
