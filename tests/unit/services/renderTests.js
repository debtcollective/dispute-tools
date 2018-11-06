const pdftk = require('node-pdftk');
const moment = require('moment');
const { expect } = require('chai');
const { render } = require('../../../services/render');
const { getConfiguration } = require('../../../services/disputeToolConfigurations');
const {
  generalDebtDispute,
  privateStudentLoanDispute: { notDefaulted: pslNotDefaulted, defaulted: pslDefaulted },
  creditReportDispute,
  taxOffsetReviews,
  wageGarnishmentDisputes,
} = require('../../utils/sampleDisputeData');
const { extractPdfText } = require('../../utils');
const {
  formatDate,
  normalizeSsn,
} = require('../../../services/renderers/tool-configurations/shared/utils');
const { doeDisclosure } = require('../../../config/config');

function basicRenderTest(sampleData, docTemplates = [1]) {
  return async function theTest(generate = 'fdf') {
    const files = await render(sampleData);
    expect(files.length).to.eq(docTemplates.length);
    return Promise.all(
      files.map(async (doc, i) => {
        expect(doc.length).to.eq(docTemplates[i]);
        return Promise.all(
          doc.map(async ({ rendered }) => {
            expect(rendered).to.be.defined;
            return generate === 'fdf'
              ? pdftk
                  .input(rendered)
                  .generateFdf()
                  .output()
              : rendered;
          }),
        );
      }),
    );
  };
}

function executeNormalize({ disputeToolId, data }) {
  const documents = getConfiguration(disputeToolId, data.option);

  return Object.keys(documents).map(k => documents[k].templates.map(t => t.normalize(data)));
}

/**
 * We don't check for NOT an array at the tail because we
 * want to make sure that we're not sending arrays that have
 * undefined values like: ['foo', undefined, 'bar]
 * @param {any} obj Object whose values should all be defined
 */
const ensureNotUndefined = obj => {
  Object.keys(obj).forEach(k => {
    const prop = obj[k];
    expect(prop !== undefined, `the normalized prop ${k} was undefined`).true;
    if (typeof prop === 'object') {
      ensureNotUndefined(prop);
    }
  });
};

/**
 * Test the normalize function for the associated template
 * to ensure that it's not returning any key-value pairs where
 * the value is undefined. This is useful for the HTML forms
 * where the word undefined will get printed as a string
 * if the value passed to locals is undefined
 * @param {any} data Sample dispute data
 */
const testNormalized = data => () => {
  const normalized = executeNormalize(data);
  normalized.forEach(n => {
    n.forEach(ensureNotUndefined);
  });
};

/**
 * Many of these tests run sequentially. We generally try
 * to avoid that as much as possible. Here, however, it prevents
 * us from having to re-render the various PDFs for each
 * result we want to check. Instead we can break the tests
 * down into three general steps:
 *
 * 1) Render the PDF:
 *     This is a smoke test. It doesn't check anything other than
 *     that the rendering pipeline works for the dispute tool configuration
 *     we passed in.
 * 2) Check that the rendered PDF the information we expect it to have:
 *     Here we mostly end up reading the files from disk and parsing the
 *     extracted FDF, in the case of a form, or the raw text in the case of
 *     the letters.
 * 3) Verify that the normalize impl does not return invalid values.
 */
describe('render', () => {
  describe('pug', () => {
    describe('general debt dispute', () => {
      let docs;
      it('should render the pdf', async () => {
        docs = await basicRenderTest(generalDebtDispute)('path');
      });

      it('should render all the form data into the letter', () => {
        const [[path]] = docs;
        const res = extractPdfText(path);
        const form = generalDebtDispute.data.forms['personal-information-form'];
        const { 'collection-notice-date': collectionDate, ...formFields } = form;

        Object.keys(formFields).forEach(field => {
          expect(res).includes(formFields[field]);
        });

        expect(res).includes(moment(collectionDate, 'MM-DD-YYYY').format('MMMM Do YYYY'));
      });

      it(
        'should not have undefined values after normalization',
        testNormalized(generalDebtDispute),
      );
    });

    describe('private student debt dispute', () => {
      describe('when not debt not in default', () => {
        let docs;
        it('should render the pdf', async () => {
          docs = await basicRenderTest(pslNotDefaulted)('path');
        });

        it('should render all the form data into the letter', () => {
          const [[path]] = docs;
          const res = extractPdfText(path);
          const form = {
            ...pslNotDefaulted.data.forms['personal-information-form'],
            // Correspondence date not present in the defaulted letter
            'last-correspondence-date': '',
          };
          // is-debt-in-default is 'no' in the form data to cause the non-defaulted letter to render.
          // This snippet of text only exists in the non-defaulted letter so we can be sure it rendered
          // the right letter and get rid of the 'no' that isn't going to be on the letter anyway
          form['is-debt-in-default'] = 'Proof of amount owed';
          Object.keys(form).forEach(k => {
            expect(res).includes(form[k]);
          });
        });

        it('should not have undefined values after normalization', testNormalized(pslNotDefaulted));
      });

      describe('when debt is in default', () => {
        let docs;
        it('should render the pdf', async () => {
          docs = await basicRenderTest(pslDefaulted)('path');
        });

        it('should render all the form data into the letter', () => {
          const [[path]] = docs;
          const res = extractPdfText(path);
          const form = { ...pslDefaulted.data.forms['personal-information-form'] };
          form['last-correspondence-date'] = formatDate(form['last-correspondence-date']);
          // is-debt-in-default is 'yes' in the form data to cause the defaulted letter to render.
          // This snippet of text only exists in the defaulted letter so we can be sure it rendered
          // the right letter and get rid of the 'yes' that isn't going to be on the letter anyway
          form['is-debt-in-default'] = 'Proof that the note is in default';
          Object.keys(form).forEach(k => {
            expect(res).includes(form[k]);
          });
        });

        it('should not have undefined values after normalization', testNormalized(pslNotDefaulted));
      });
    });

    describe('credit report dispute letter', () => {
      let docs;
      it('should render the pdf', async () => {
        docs = await basicRenderTest(creditReportDispute, [2])('path');
      });

      it('should render all the form data into the letter', () => {
        const [[path]] = docs;
        const res = extractPdfText(path);

        const form = {
          ...creditReportDispute.data.forms['personal-information-form'],
          // Doesn't actually render the agencies except into the agencies list document
          agencies: '',
        };

        Object.keys(form).forEach(k => {
          expect(res).includes(form[k]);
        });
      });

      it(
        'should not have undefined values after normalization',
        testNormalized(creditReportDispute),
      );
    });
  });

  describe('pdf', () => {
    const personalInfoKeys = ['city', 'name', 'state', 'address1', 'zip-code'];
    const employmentInfoKeys = [
      'er',
      'erCity',
      'erPhone',
      'erState',
      'mentDate',
      'erZipCode',
      'erAddress1',
    ];
    const schoolInfoKeys = ['Name', '-city', '-state', '-address', '-zip-code'];
    // prettier-ignore
    const supplementalKeys = ['program-of-study', 'option5-text', 'tuition-payment', 'entrance-exam-supporter-zip-code',
      'entrance-exam-supporter-name', 'entrance-exam-supporter-phone', 'entrance-exam-supporter-city', 'student-name',
      'entrance-exam-supporter-state', 'entrance-exam-improper-explain', 'entrance-exam-supporter-address', 'law'];

    const expectObjectionNum = (fdf, num) =>
      expect(fdf.includes(num), `the objection number ${num} is not marked correctly`).true;

    const expectContains = (fdf, testData, keys, prefix = '') => {
      const formData = testData.data.forms['personal-information-form'];
      keys.forEach(key => {
        const pkey = prefix + key;
        if (formData[pkey]) {
          expect(
            fdf.includes(formData[pkey]),
            `generated pdf does not contain ${pkey} (${formData[pkey]})`,
          ).true;
        }
      });
    };

    const expectCheckboxes = (fdf, checkboxKey, yeses, nos = []) => {
      // These are expected to have a value of `1`
      yeses.forEach(n => {
        // prettier-ignore
        const reg = new RegExp(`\\\/V \\\/1\\n\\\/T \\(${checkboxKey}\\[${n}\\]\\)`); // eslint-disable-line

        expect(reg.test(fdf), `generated pdf did not contain ${checkboxKey} ${n}`).true;
      });
      // These are expected to have a value of `Off`
      nos.forEach(n => {
        // prettier-ignore
        const reg = new RegExp(`\\\/V \\\/Off\\n\\\/T \\(${checkboxKey}\\[${n}\\]\\)`); // eslint-disable-line

        expect(reg.test(fdf), `generated pdf incorrectly contained ${checkboxKey} ${n}`).true;
      });
    };

    const expectCorrectLoanDischargeApplication = (fdf, form, supplementalPrefix) => {
      expectContains(fdf, form, personalInfoKeys);
      expectContains(fdf, form, schoolInfoKeys, 'school');
      expectContains(fdf, form, supplementalKeys, supplementalPrefix);
    };

    describe('tax offset review', () => {
      describe('A', () => {
        let docs;
        it('should render the pdf', async () => {
          docs = await basicRenderTest(taxOffsetReviews.A, [1])();
        });

        it(
          'should not have undefined values after normalization',
          testNormalized(taxOffsetReviews.A),
        );

        it('should have the correct data in the fdfs', () => {
          const [[fdf]] = docs;
          expectContains(fdf, taxOffsetReviews.A, [...personalInfoKeys, 'ssn']);
        });
      });

      describe('B', () => {
        let docs;
        it('should render the pdf', async () => {
          docs = await basicRenderTest(taxOffsetReviews.B, [1])();
        });

        it(
          'should not have undefined values after normalization',
          testNormalized(taxOffsetReviews.B),
        );

        it('should have the correct data in the fdfs', () => {
          const [[fdf]] = docs;
          expectContains(fdf, taxOffsetReviews.B, [...personalInfoKeys, 'ssn']);
          expectContains(fdf, taxOffsetReviews.B, ['phone']);
          expectObjectionNum(fdf, '7');
        });
      });

      describe('C', () => {
        const { CasStudent, CasParent, CwithSupporter } = taxOffsetReviews;

        describe('as student', () => {
          let taxOffsetReviewFdf;
          let federalFormFdf;
          describe('render', () => {
            it('works', async () => {
              [[taxOffsetReviewFdf], [federalFormFdf]] = await basicRenderTest(CasStudent, [
                1,
                1,
              ])();
            });
            it('should not have undefined values after normalization', testNormalized(CasStudent));
          });

          describe('result contents', () => {
            it('tax offset review form', () => {
              expectContains(taxOffsetReviewFdf, CasStudent, [
                ...personalInfoKeys,
                'schoolName',
                'ssn',
              ]);
            });
            it('falsecert ability to benefit form', () => {
              expectCorrectLoanDischargeApplication(federalFormFdf, CasStudent, 'atb-');
            });
          });
        });

        describe('as parent', () => {
          let taxOffsetReviewFdf;
          let abilityToBenefitFormFdf;
          describe('render', () => {
            it('works', async () => {
              [[taxOffsetReviewFdf], [abilityToBenefitFormFdf]] = await basicRenderTest(CasParent, [
                1,
                1,
              ])();
            });
            it('should not have undefined values after normalization', testNormalized(CasParent));
          });

          describe('result contents', () => {
            it('tax offset review form', () => {
              expectContains(taxOffsetReviewFdf, CasParent, [
                ...personalInfoKeys,
                'schoolName',
                'ssn',
              ]);
            });
            it('falsecert ability to benefit form', () => {
              expectContains(abilityToBenefitFormFdf, CasParent, ['atb-student-name']);
              expectCorrectLoanDischargeApplication(abilityToBenefitFormFdf, CasParent, 'atb-');
            });
          });
        });

        describe('with supporter for claim that exam was improperly administered', () => {
          let taxOffsetReviewFdf;
          let abilityToBenefitFormFdf;
          describe('render', () => {
            it('works', async () => {
              [[taxOffsetReviewFdf], [abilityToBenefitFormFdf]] = await basicRenderTest(
                CwithSupporter,
                [1, 1],
              )();
            });
            it(
              'should not have undefined values after normalization',
              testNormalized(CwithSupporter),
            );
          });

          describe('result contents', () => {
            it('tax offset review form', () => {
              expectContains(taxOffsetReviewFdf, CwithSupporter, [
                ...personalInfoKeys,
                'schoolName',
                'ssn',
              ]);
            });
            it('falsecert ability to benefit form', () => {
              expectContains(abilityToBenefitFormFdf, CwithSupporter, [
                'atb-entrance-exam-supporter-name',
                'atb-entrance-exam-supporter-address',
                'atb-entrance-exam-supporter-city',
                'atb-entrance-exam-supporter-phone',
                'atb-entrance-exam-supporter-zip-code',
              ]);
              expectCorrectLoanDischargeApplication(
                abilityToBenefitFormFdf,
                CwithSupporter,
                'atb-',
              );
            });
          });
        });
      });

      describe('D', () => {
        const { DasParent, DasStudent } = taxOffsetReviews;
        describe('as parent', () => {
          let taxOffsetReviewFdf;
          let falsecertDisqualifyingFdf;
          describe('render', () => {
            it('works', async () => {
              [[taxOffsetReviewFdf], [falsecertDisqualifyingFdf]] = await basicRenderTest(
                DasParent,
                [1, 1],
              )();
            });
            it('should not have undefined values after normalization', testNormalized(DasParent));
          });

          describe('result contents', () => {
            it('tax offset review form', () => {
              expectContains(taxOffsetReviewFdf, DasParent, [
                ...personalInfoKeys,
                'ssn',
                'schoolName',
                'phone',
              ]);
              expectObjectionNum(taxOffsetReviewFdf, '11');
            });
            it('falsecert disqualifying form', () => {
              expectContains(falsecertDisqualifyingFdf, DasParent, [
                'atbd-student-name',
                'atbd-option5-text',
              ]);
              expectCorrectLoanDischargeApplication(falsecertDisqualifyingFdf, DasParent, 'atbd-');
            });
          });
        });

        describe('as student', () => {
          let taxOffsetReviewFdf;
          let falsecertDisqualifyingFdf;
          describe('render', () => {
            it('works', async () => {
              [[taxOffsetReviewFdf], [falsecertDisqualifyingFdf]] = await basicRenderTest(
                DasStudent,
                [1, 1],
              )();
            });
            it('should not have undefined values after normalization', testNormalized(DasStudent));
          });

          describe('result contents', () => {
            it('tax offset review form', () => {
              expectContains(taxOffsetReviewFdf, DasStudent, [
                ...personalInfoKeys,
                'ssn',
                'schoolName',
                'phone',
              ]);
              // INPERSON disputeProcess
              expectObjectionNum(taxOffsetReviewFdf, '11');
            });
            it('falsecert disqualifying form', () => {
              expectContains(falsecertDisqualifyingFdf, DasStudent, ['atbd-option5-text']);
              expectCorrectLoanDischargeApplication(falsecertDisqualifyingFdf, DasStudent, 'atbd-');
            });
          });
        });
      });

      describe('E', () => {
        const { EasStudent, EasParent } = taxOffsetReviews;
        describe('as student', () => {
          let taxOffsetReviewFdf;
          let badSignatureFdf;
          describe('render', () => {
            it('works', async () => {
              [[taxOffsetReviewFdf], [badSignatureFdf]] = await basicRenderTest(EasStudent, [
                1,
                1,
              ])();
            });
            it('should not have undefined values after normalization', testNormalized(EasStudent));
          });

          describe('result contents', () => {
            it('tax offset review form', () => {
              expectContains(taxOffsetReviewFdf, EasStudent, [
                ...personalInfoKeys,
                'ssn',
                'schoolName',
                'phone',
              ]);
              expectObjectionNum(taxOffsetReviewFdf, '12');
            });
            it('falsecert disqualifying form', () => {
              expectContains(badSignatureFdf, EasStudent, [
                'fc-explain',
                'schoolName',
                'school-city',
                'school-state',
              ]);
              // a - c
              expectCheckboxes(badSignatureFdf, 'Documents', [0, 1, 2], [3, 4, 5, 6]);
              expectCorrectLoanDischargeApplication(badSignatureFdf, EasStudent, 'fc-');
            });
          });
        });
        describe('as parent', () => {
          let taxOffsetReviewFdf;
          let badSignatureFdf;
          describe('render', () => {
            it('works', async () => {
              [[taxOffsetReviewFdf], [badSignatureFdf]] = await basicRenderTest(EasParent, [
                1,
                1,
              ])();
            });
            it('should not have undefined values after normalization', testNormalized(EasParent));
          });

          describe('result contents', () => {
            it('tax offset review form', () => {
              expectContains(taxOffsetReviewFdf, EasParent, [
                ...personalInfoKeys,
                'ssn',
                'schoolName',
                'phone',
              ]);
              expectObjectionNum(taxOffsetReviewFdf, '12');
            });
            it('falsecert disqualifying form', () => {
              expectContains(badSignatureFdf, EasParent, [
                'fc-explain',
                'schoolName',
                'school-city',
                'school-state',
              ]);
              // d - g
              expectCheckboxes(badSignatureFdf, 'Documents', [3, 4, 5, 6], [0, 1, 2]);
              expectCorrectLoanDischargeApplication(badSignatureFdf, EasParent, 'fc-');
            });
          });
        });
      });
    });

    describe('wage garnishment dispute', () => {
      const expectCorrectForm = (fdf, form) => {
        expectContains(fdf, form, personalInfoKeys.concat(['ssn']));
        expectContains(fdf, form, employmentInfoKeys, 'employ');
      };

      // No need to write multiple tests for the DOE privacy disclosure form
      // as if it gets included/rendered when we don't expect it then the number
      // of documents will be wrong and the tests will begin to fail.
      describe('DOE privacy disclosure form', () => {
        it('should have been rendered', async () => {
          const [[, path]] = await basicRenderTest(wageGarnishmentDisputes.AwithRelease, [2])(
            'path',
          );

          const res = extractPdfText(path);
          const form = wageGarnishmentDisputes.AwithRelease.data.forms['personal-information-form'];
          ['name', 'address1', 'email', 'city', 'state', 'zip-code'].forEach(k => {
            expect(res).includes(form[k]);
          });

          expect(res).includes(wageGarnishmentDisputes.AwithRelease.data.signature);
          expect(res).includes(normalizeSsn(form.ssn).join('-'));
          expect(res).includes(formatDate(form.dob, 'MM/DD/YY'));

          ['representatives', 'address', 'city', 'state', 'zip', 'phones', 'relationship'].forEach(
            doeDisclosureKey => {
              expect(res).includes(doeDisclosure[doeDisclosureKey]);
            },
          );
        });
      });

      it('a: should render the pdf', async () => {
        const [[fdf]] = await basicRenderTest(wageGarnishmentDisputes.A, [1])();

        expectCorrectForm(fdf, wageGarnishmentDisputes.A);
      });

      it('b: should render the pdf', async () => {
        const [[fdf]] = await basicRenderTest(wageGarnishmentDisputes.B, [1])();

        expectCorrectForm(fdf, wageGarnishmentDisputes.B);

        // because dispute option is INPERSON
        expectObjectionNum(fdf, '10');
        expect(fdf.includes('X'), 'disputeProcessCity is not selected').true;
      });

      it('c: should render the pdf', async () => {
        const [[wageGarnishentFdf]] = await basicRenderTest(wageGarnishmentDisputes.CasStudent, [
          1,
          1,
        ])();

        expectCorrectForm(wageGarnishentFdf, wageGarnishmentDisputes.CasStudent);
      });

      it('d: should render the pdf', async () => {
        const [[wageGarnishentFdf]] = await basicRenderTest(wageGarnishmentDisputes.DasStudent, [
          1,
          1,
        ])();

        expectCorrectForm(wageGarnishentFdf, wageGarnishmentDisputes.DasStudent);
        expectContains(wageGarnishentFdf, wageGarnishmentDisputes.DasStudent, ['schoolName']);

        // because dispute option is BYPHONE
        expectContains(wageGarnishentFdf, wageGarnishmentDisputes.DasStudent, ['phone']);
        expectObjectionNum(wageGarnishentFdf, '12');
      });

      it('e: should render the pdf', async () => {
        const [[wageGarnishentFdf]] = await basicRenderTest(wageGarnishmentDisputes.EasParent, [
          1,
          1,
        ])();

        expectCorrectForm(wageGarnishentFdf, wageGarnishmentDisputes.EasParent);
        expectContains(wageGarnishentFdf, wageGarnishmentDisputes.EasParent, ['schoolName']);

        // because dispute option is INPERSON
        expectObjectionNum(wageGarnishentFdf, '14');
        expect(wageGarnishentFdf.includes('X'), 'disputeProcessCity is not selected').true;
      });
    });
  });
});
