const normalizeSSN = (ssn) => {
  ssn = ssn.split('-').split('_').join('');

  const result = [];

  result.push(ssn.substr(0, 3));
  result.push(ssn.substr(4, 5));
  result.push(ssn.substr(4, 5));

  return result;
};

module.exports = {
  '11111111-1111-1111-1111-111111111111': {
    A: {
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
    B: {
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
    C: {
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
        ability_to_benefit: {
          templates: [
            {
              path: '/lib/assets/document_templates/falsecert_ability_to_benefit/0.png',

              fields: {
                ssn(template, data) {
                  const result = normalizeSSN(data
                    .forms['personal-information-form'].ssn);

                  template
                    .font('Arial')
                    .fontSize(38)
                    .drawText(1434, 784, result[0])
                    .drawText(1640, 784, result[1])
                    .drawText(1788, 784, result[2]);
                },
                'personal-information-form.name': {
                  x: 1430,
                  y: 866,
                },
                'personal-information-form.address1': {
                  x: 1430,
                  y: 944,
                },
                'personal-information-form.address2': {
                  x: 1430,
                  y: 1016,
                },
                'personal-information-form.phone': {
                  x: 1430,
                  y: 1094,
                },
                'personal-information-form.email': {
                  x: 1430,
                  y: 1244,
                },
                /*
                  ATB FORM
                */
                atbApplyingAs(template, data) {
                  const value = data.forms['personal-information-form']['atb-applyin-as'];

                  const x = 243;
                  let y = 1448;

                  if (value === 'yes') {
                    y = 1500;
                  }

                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(x, y, 'P');
                },
                atbStudentName(template, data) {
                  const check = data.forms['personal-information-form']['atb-applyin-as'];

                  if (check === 'yes') {
                    return;
                  }

                  const value = data.forms['personal-information-form']['atb-student-name'];

                  template
                    .font('Arial')
                    .fontSize(38)
                    .drawText(227, 1640, value);
                },
                atbStudentSsn(template, data) {
                  const check = data.forms['personal-information-form']['atb-applyin-as'];

                  if (check === 'yes') {
                    return;
                  }

                  const result = normalizeSSN(data
                    .forms['personal-information-form']['atb-student-name']);

                  template
                    .font('Arial')
                    .fontSize(38)
                    .drawText(1434, 784, result[0])
                    .drawText(1640, 784, result[1])
                    .drawText(1788, 784, result[2]);
                },
              },
              atbAttendedAt(template, data) {
                const value = data.forms['personal-information-form']['atb-attended-at'];

                const x = 243;
                let y = 1996;

                if (value === 'yes') {
                  y = 1948;
                }

                template
                  .font('Wingdings2')
                  .fontSize(48)
                  .drawText(x, y, 'P');
              },
              atbAttendedWhere(template, data) {
                const value = data.forms['personal-information-form']['atb-attended-where'];

                const x = 243;
                let y = 2300;

                if (value === 'yes') {
                  y = 2248;
                }

                template
                  .font('Wingdings2')
                  .fontSize(48)
                  .drawText(x, y, 'P');
              },
              'personal-information-form.atb-school-name': {
                x: 308,
                y: 2568,
              },
              'personal-information-form.atb-school-address': {
                x: 308,
                y: 2696,
              },
              'personal-information-form.atb-school-address2': {
                x: 308,
                y: 2744,
              },
              'personal-information-form.atb-school-date': {
                x: 308,
                y: 2992,
              },
              atbNumberEight(template) {
                template
                  .font('Wingdings2')
                  .fontSize(48)
                  .drawText(1418, 1572, 'P');
              },
              'personal-information-form.atb-attendance-from': {
                x: 1410,
                y: 2068,
              },
              'personal-information-form.atb-attendance-to': {
                x: 1802,
                y: 2068,
              },
              'personal-information-form.atb-program-of-study': {
                x: 1410,
                y: 2368,
              },
              atbHaveGED(template, data) {
                const value = data.forms['personal-information-form']['atb-have-ged'];

                const x = 1418;
                let y = 2648;

                if (value === 'yes') {
                  y = 2600;
                }

                template
                  .font('Wingdings2')
                  .fontSize(48)
                  .drawText(x, y, 'P');
              },
              atbReceivedGED(template, data) {
                const value = data.forms['personal-information-form']['atb-received-ged'];

                const y = 2848;
                let x = 1622;

                if (value === 'yes') {
                  x = 1418;
                }

                template
                  .font('Wingdings2')
                  .fontSize(48)
                  .drawText(x, y, 'P');
              },
              'personal-information-form.atb-anrolled-at': {
                x: 1410,
                y: 2992,
              },
            },
          ],
        },
      },
    },
  },
};
