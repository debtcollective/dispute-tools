const normalizeSSN = (ssn) => {
  ssn = ssn.split('-').join('').split('_').join('');

  const result = [];

  result.push(ssn.substr(0, 3));
  result.push(ssn.substr(3, 2));
  result.push(ssn.substr(5, 4));

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
                      .font('Wingdings2')
                      .fontSize(48)
                      .drawText(_x, _y, 'P');
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
                    .fontSize(42)
                    .drawText(440, 2354,
                      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
                },
                signature(template, data) {
                  template
                    .font('Arial')
                    .fontSize(42)
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
                      .font('Wingdings2')
                      .fontSize(48)
                      .drawText(_x, _y, 'P');
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
                    .fontSize(42)
                    .drawText(440, 2354,
                      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
                },
                signature(template, data) {
                  template
                    .font('Arial')
                    .fontSize(42)
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
                      .font('Wingdings2')
                      .fontSize(48)
                      .drawText(_x, _y, 'P');
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
                    .fontSize(42)
                    .drawText(440, 2354,
                      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
                },
                signature(template, data) {
                  template
                    .font('Arial')
                    .fontSize(42)
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
                    .fontSize(42)
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
                  const value = data.forms['personal-information-form']['atb-applying-as'];

                  const x = 233;
                  let y = 1468;

                  if (value === 'yes') {
                    y = 1520;
                  }

                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(x, y, 'P');
                },
                atbStudentName(template, data) {
                  const check = data.forms['personal-information-form']['atb-applying-as'];

                  if (check === 'no') {
                    return;
                  }

                  const value = data.forms['personal-information-form']['atb-student-name'];

                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(227, 1640, value);
                },
                atbStudentSsn(template, data) {
                  const check = data.forms['personal-information-form']['atb-applying-as'];

                  if (check === 'no') {
                    return;
                  }

                  const result = normalizeSSN(data
                    .forms['personal-information-form']['atb-student-ssn']);

                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(242, 1766, result[0])
                    .drawText(436, 1766, result[1])
                    .drawText(586, 1766, result[2]);
                },
                atbAttendedAt(template, data) {
                  const value = data.forms['personal-information-form']['atb-attended-at'];

                  const x = 233;
                  let y = 2026;

                  if (value === 'yes') {
                    y = 1978;
                  }

                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(x, y, 'P');
                },
                atbAttendedWhere(template, data) {
                  const value = data.forms['personal-information-form']['atb-attended-where'];

                  const x = 233;
                  let y = 2268;

                  if (value === 'yes') {
                    y = 2208;
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
                  x: 233,
                  y: 2992,
                },
                atbNumberEight(template) {
                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(1408, 1592, 'P');
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

                  const x = 1408;
                  let y = 2668;

                  if (value === 'yes') {
                    y = 2620;
                  }

                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(x, y, 'P');
                },
                atbReceivedGED(template, data) {
                  const value = data.forms['personal-information-form']['atb-received-ged'];

                  const y = 2868;
                  let x = 1612;

                  if (value === 'yes') {
                    x = 1408;
                  }

                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(x, y, 'P');
                },
                'personal-information-form.atb-enrolled-at': {
                  x: 1410,
                  y: 2992,
                },
              },
            },
            {
              path: '/lib/assets/document_templates/falsecert_ability_to_benefit/1.png',
              fields: {
                atbEntranceExam(template, data) {
                  const value = data.forms['personal-information-form']['atb-entrance-exam'];

                  const x = 257;
                  let y = 602;

                  if (value === 'yes') {
                    y = 550;
                  }

                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(x, y, 'P');
                },
                'personal-information-form.atb-entrance-exam-date': {
                  x: 252,
                  y: 768,
                },
                'personal-information-form.atb-entrance-exam-name': {
                  x: 252,
                  y: 894,
                },
                'personal-information-form.atb-entrance-exam-score': {
                  x: 252,
                  y: 1020,
                },

                atbEntranceExamImproper(template, data) {
                  const value =
                   data.forms['personal-information-form']['atb-entrance-exam-improper'];

                  const x = 257;
                  let y = 1270;

                  if (value === 'yes') {
                    y = 1218;
                  }

                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(x, y, 'P');
                },

                'personal-information-form.atb-entrance-exam-improper-explain': {
                  x: 252,
                  y: 1394,
                },
                'personal-information-form.atb-entrance-exam-improper-explain2': {
                  x: 252,
                  y: 1442,
                },

                'personal-information-form.atb-entrance-exam-supporter-name': {
                  x: 476,
                  y: 1644,
                },
                'personal-information-form.atb-entrance-exam-supporter-address': {
                  x: 328,
                  y: 1768,
                },
                'personal-information-form.atb-entrance-exam-supporter-address2': {
                  x: 328,
                  y: 1820,
                },
                'personal-information-form.atb-entrance-exam-supporter-phone': {
                  x: 328,
                  y: 1944,
                },

                atbRemedialProgramCompleted(template, data) {
                  const value =
                   data.forms['personal-information-form']['atb-remedial-program-completed'];

                  const x = 257;
                  let y = 2242;

                  if (value === 'yes') {
                    y = 2196;
                  }

                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(x, y, 'P');
                },
                'personal-information-form.atb-remedial-program-name': {
                  x: 258,
                  y: 2416,
                },
                'personal-information-form.atb-remedial-program-from': {
                  x: 258,
                  y: 2544,
                },
                'personal-information-form.atb-remedial-program-to': {
                  x: 652,
                  y: 2544,
                },
                'personal-information-form.atb-remedial-program-courses': {
                  x: 258,
                  y: 2670,
                },
                'personal-information-form.atb-remedial-program-courses2': {
                  x: 258,
                  y: 2718,
                },
                'personal-information-form.atb-remedial-program-grades': {
                  x: 258,
                  y: 2842,
                },
                'personal-information-form.atb-remedial-program-grades2': {
                  x: 258,
                  y: 2892,
                },

                atbCompleteCredit(template, data) {
                  const value =
                   data.forms['personal-information-form']['atb-complete-credit'];

                  const x = 1402;
                  let y = 694;

                  if (value === 'yes') {
                    y = 642;
                  }

                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(x, y, 'P');
                },

                _29(template) {
                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(1412, 1044, 'P');
                },
                _32(template) {
                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(1412, 1830, 'P');
                },
              },
            },
            {
              path: '/lib/assets/document_templates/falsecert_ability_to_benefit/2.png',
              fields: {
                signature(template, data) {
                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(580, 1116, data.signature);

                  const date = new Date();

                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(1852, 1116,
                      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
                },
              },
            },
            {
              path: '/lib/assets/document_templates/falsecert_ability_to_benefit/3.png',
              fields: {},
            },
            {
              path: '/lib/assets/document_templates/falsecert_ability_to_benefit/4.png',
              fields: {},
            },
          ],
        },
      },
    },
    D: {
      documents: {
        unauthorized_signature_form: {
          templates: [
            {
              path: '/lib/assets/document_templates/wage_garnishment/0.png',
              fields: {
                ssn(template, data) {
                  const result = normalizeSSN(data
                    .forms['personal-information-form'].ssn);

                  template
                    .font('Arial')
                    .fontSize(42)
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
                'personal-information-form.phone': {
                  x: 1430,
                  y: 1168,
                },
                'personal-information-form.email': {
                  x: 1430,
                  y: 1244,
                },

                // FC FORM
                atbApplyingAs(template, data) {
                  const value = data.forms['personal-information-form']['fc-applying-as'];

                  const x = 233;
                  let y = 1468;

                  if (value === 'yes') {
                    y = 1520;
                  }

                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(x, y, 'P');
                },
                atbStudentName(template, data) {
                  const check = data.forms['personal-information-form']['fc-applying-as'];

                  if (check === 'no') {
                    return;
                  }

                  const value = data.forms['personal-information-form']['fc-student-name'];

                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(300, 1640, value);
                },
                atbStudentSsn(template, data) {
                  const check = data.forms['personal-information-form']['fc-applying-as'];

                  if (check === 'no') {
                    return;
                  }

                  const result = normalizeSSN(data
                    .forms['personal-information-form']['fc-student-ssn']);

                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(300, 1766, result[0])
                    .drawText(508, 1766, result[1])
                    .drawText(658, 1766, result[2]);
                },
              },
              'personal-information-form.fc-school-name': {
                x: 300,
                y: 2068,
              },
              'personal-information-form.fc-school-address': {
                x: 300,
                y: 2218,
              },
              'personal-information-form.fc-school-address2': {
                x: 300,
                y: 2268,
              },
              'personal-information-form.fc-attendance-from': {
                x: 300,
                y: 2420,
              },
              'personal-information-form.fc-attendance-to': {
                x: 700,
                y: 2420,
              },

              documentsA(template, data) {
                if (data.forms['personal-information-form']['fc-documents-a'] === 'yes') {
                  template
                  .font('Wingdings2')
                  .fontSize(48)
                  .drawText(386, 2630, 'P');
                }

                return;
              },
              documentsB(template, data) {
                if (data.forms['personal-information-form']['fc-documents-b'] === 'yes') {
                  template
                  .font('Wingdings2')
                  .fontSize(48)
                  .drawText(386, 2678, 'P');
                }

                return;
              },
              documentsC(template, data) {
                if (data.forms['personal-information-form']['fc-documents-c'] === 'yes') {
                  template
                  .font('Wingdings2')
                  .fontSize(48)
                  .drawText(386, 2730, 'P');
                }

                return;
              },
              documentsD(template, data) {
                if (data.forms['personal-information-form']['fc-documents-d'] === 'yes') {
                  template
                  .font('Wingdings2')
                  .fontSize(48)
                  .drawText(386, 2778, 'P');
                }

                return;
              },
              documentsE(template, data) {
                if (data.forms['personal-information-form']['fc-documents-e'] === 'yes') {
                  template
                  .font('Wingdings2')
                  .fontSize(48)
                  .drawText(386, 2830, 'P');
                }

                return;
              },
              documentsF(template, data) {
                if (data.forms['personal-information-form']['fc-documents-f'] === 'yes') {
                  template
                  .font('Wingdings2')
                  .fontSize(48)
                  .drawText(386, 2878, 'P');
                }

                return;
              },
              documentsG(template, data) {
                if (data.forms['personal-information-form']['fc-documents-g'] === 'yes') {
                  template
                  .font('Wingdings2')
                  .fontSize(48)
                  .drawText(386, 2930, 'P');
                }

                return;
              },

              number8(template) {
                template
                  .font('Wingdings2')
                  .fontSize(48)
                  .drawText(1426, 1780, 'P');
              },

              'personal-information-form.fc-tuition-payment': {
                x: 1400,
                y: 2570,
              },
              'personal-information-form.fc-tuition-payment2': {
                x: 1400,
                y: 2618,
              },

              number12(template) {
                template
                  .font('Arial')
                  .fontSize(42)
                  .drawText(1628, 3016, 'I don\'t know');
              },
            },
            {
              path: '/lib/assets/document_templates/wage_garnishment/1.png',
              fields: {
                // FC PAGE 2
                'personal-information-form.fc-explain': {
                  x: 230,
                  y: 594,
                },
                'personal-information-form.fc-explain2': {
                  x: 230,
                  y: 644,
                },

                number14(template) {
                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(248, 1128, 'P');
                },

                number18(template) {
                  template
                    .font('Wingdings2')
                    .fontSize(48)
                    .drawText(1400, 1084, 'P');
                },

                signature(template, data) {
                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(580, 3144, data.signature);

                  const date = new Date();

                  template
                    .font('Arial')
                    .fontSize(42)
                    .drawText(1852, 3144,
                      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
                },
              },
            },
            {
              path: '/lib/assets/document_templates/wage_garnishment/2.png',
              fields: {},
            },
            {
              path: '/lib/assets/document_templates/wage_garnishment/3.png',
              fields: {},
            },
          ],
        },
      },
    },
  },
};
