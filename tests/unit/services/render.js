const pdftk = require('node-pdftk');
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

function basicRenderTest(sampleData, docTemplates = [1]) {
  return async function theTest() {
    const files = await render(sampleData);
    expect(files.length).to.eq(docTemplates.length);
    return Promise.all(
      files.map(async (doc, i) => {
        expect(doc.length).to.eq(docTemplates[i]);
        return Promise.all(
          doc.map(async ({ rendered }) => {
            expect(rendered).to.be.defined;
            return pdftk
              .input(rendered)
              .generateFdf()
              .output();
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

describe('render', () => {
  describe('pug', () => {
    describe('general debt dispute', () => {
      it('should render the pdf', basicRenderTest(generalDebtDispute));
      it('should not have undefined values after normalization', testNormalized(generalDebtDispute));
    });

    describe('private student debt dispute', () => {
      describe('when not debt not in default', () => {
        it('should render the pdf', basicRenderTest(pslNotDefaulted));
        it('should not have undefined values after normalization', testNormalized(pslNotDefaulted));
      });

      describe('when debt is in default', () => {
        it('should render the pdf', basicRenderTest(pslDefaulted));
        it('should not have undefined values after normalization', testNormalized(pslNotDefaulted));
      });
    });

    describe('credit report dispute letter', () => {
      it('should render the pdf', basicRenderTest(creditReportDispute, [2]));
      it('should not have undefined values after normalization', testNormalized(creditReportDispute));
    });
  });

  describe('pdf', () => {
    const personalInfoKeys = ['city', 'name', 'state', 'address1', 'zip-code'];
    const employmentInfoKeys = ['er', 'erCity', 'erPhone', 'erState', 'mentDate', 'erZipCode', 'erAddress1'];
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
          expect(fdf.includes(formData[pkey]), `generated pdf does not contain ${pkey} (${formData[pkey]})`).true;
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

        it('should not have undefined values after normalization', testNormalized(taxOffsetReviews.A));

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

        it('should not have undefined values after normalization', testNormalized(taxOffsetReviews.B));

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
              [[taxOffsetReviewFdf], [federalFormFdf]] = await basicRenderTest(CasStudent, [1, 1])();
            });
            it('should not have undefined values after normalization', testNormalized(CasStudent));
          });

          describe('result contents', () => {
            it('tax offset review form', () => {
              expectContains(taxOffsetReviewFdf, CasStudent, [...personalInfoKeys, 'schoolName', 'ssn']);
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
              [[taxOffsetReviewFdf], [abilityToBenefitFormFdf]] = await basicRenderTest(CasParent, [1, 1])();
            });
            it('should not have undefined values after normalization', testNormalized(CasParent));
          });

          describe('result contents', () => {
            it('tax offset review form', () => {
              expectContains(taxOffsetReviewFdf, CasParent, [...personalInfoKeys, 'schoolName', 'ssn']);
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
              [[taxOffsetReviewFdf], [abilityToBenefitFormFdf]] = await basicRenderTest(CwithSupporter, [1, 1])();
            });
            it('should not have undefined values after normalization', testNormalized(CwithSupporter));
          });

          describe('result contents', () => {
            it('tax offset review form', () => {
              expectContains(taxOffsetReviewFdf, CwithSupporter, [...personalInfoKeys, 'schoolName', 'ssn']);
            });
            it('falsecert ability to benefit form', () => {
              expectContains(abilityToBenefitFormFdf, CwithSupporter, [
                'atb-entrance-exam-supporter-name',
                'atb-entrance-exam-supporter-address',
                'atb-entrance-exam-supporter-city',
                'atb-entrance-exam-supporter-phone',
                'atb-entrance-exam-supporter-zip-code',
              ]);
              expectCorrectLoanDischargeApplication(abilityToBenefitFormFdf, CwithSupporter, 'atb-');
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
              [[taxOffsetReviewFdf], [falsecertDisqualifyingFdf]] = await basicRenderTest(DasParent, [1, 1])();
            });
            it('should not have undefined values after normalization', testNormalized(DasParent));
          });

          describe('result contents', () => {
            it('tax offset review form', () => {
              expectContains(taxOffsetReviewFdf, DasParent, [...personalInfoKeys, 'ssn', 'schoolName', 'phone']);
              expectObjectionNum(taxOffsetReviewFdf, '11');
            });
            it('falsecert disqualifying form', () => {
              expectContains(falsecertDisqualifyingFdf, DasParent, ['atbd-student-name', 'atbd-option5-text']);
              expectCorrectLoanDischargeApplication(falsecertDisqualifyingFdf, DasParent, 'atbd-');
            });
          });
        });

        describe('as student', () => {
          let taxOffsetReviewFdf;
          let falsecertDisqualifyingFdf;
          describe('render', () => {
            it('works', async () => {
              [[taxOffsetReviewFdf], [falsecertDisqualifyingFdf]] = await basicRenderTest(DasStudent, [1, 1])();
            });
            it('should not have undefined values after normalization', testNormalized(DasStudent));
          });

          describe('result contents', () => {
            it('tax offset review form', () => {
              expectContains(taxOffsetReviewFdf, DasStudent, [...personalInfoKeys, 'ssn', 'schoolName', 'phone']);
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
              [[taxOffsetReviewFdf], [badSignatureFdf]] = await basicRenderTest(EasStudent, [1, 1])();
            });
            it('should not have undefined values after normalization', testNormalized(EasStudent));
          });

          describe('result contents', () => {
            it('tax offset review form', () => {
              expectContains(taxOffsetReviewFdf, EasStudent, [...personalInfoKeys, 'ssn', 'schoolName', 'phone']);
              expectObjectionNum(taxOffsetReviewFdf, '12');
            });
            it('falsecert disqualifying form', () => {
              expectContains(badSignatureFdf, EasStudent, ['fc-explain', 'schoolName', 'school-city', 'school-state']);
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
              [[taxOffsetReviewFdf], [badSignatureFdf]] = await basicRenderTest(EasParent, [1, 1])();
            });
            it('should not have undefined values after normalization', testNormalized(EasParent));
          });

          describe('result contents', () => {
            it('tax offset review form', () => {
              expectContains(taxOffsetReviewFdf, EasParent, [...personalInfoKeys, 'ssn', 'schoolName', 'phone']);
              expectObjectionNum(taxOffsetReviewFdf, '12');
            });
            it('falsecert disqualifying form', () => {
              expectContains(badSignatureFdf, EasParent, ['fc-explain', 'schoolName', 'school-city', 'school-state']);
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

      it('a: should render the pdf', async () => {
        const [[fdf]] = await basicRenderTest(wageGarnishmentDisputes.A, [1])();

        expectCorrectForm(fdf, wageGarnishmentDisputes.A);
      });

      it('b: should render the pdf', async () => {
        const [[fdf]] = await basicRenderTest(wageGarnishmentDisputes.B, [1])();

        expectCorrectForm(fdf, wageGarnishmentDisputes.B);

        // because dispute option is INPERSON
        expectObjectionNum(fdf, '10');
        expect(fdf.includes('X'), `disputeProcessCity is not selected`).true;
      });

      it('c: should render the pdf', async () => {
        const [[wageGarnishentFdf]] = await basicRenderTest(wageGarnishmentDisputes.CasStudent, [1, 1])();

        expectCorrectForm(wageGarnishentFdf, wageGarnishmentDisputes.CasStudent);
      });

      it('d: should render the pdf', async () => {
        const [[wageGarnishentFdf]] = await basicRenderTest(wageGarnishmentDisputes.DasStudent, [1, 1])();

        expectCorrectForm(wageGarnishentFdf, wageGarnishmentDisputes.DasStudent);
        expectContains(wageGarnishentFdf, wageGarnishmentDisputes.DasStudent, ['schoolName']);

        // because dispute option is BYPHONE
        expectContains(wageGarnishentFdf, wageGarnishmentDisputes.DasStudent, ['phone']);
        expectObjectionNum(wageGarnishentFdf, '12');
      });

      it('e: should render the pdf', async () => {
        const [[wageGarnishentFdf]] = await basicRenderTest(wageGarnishmentDisputes.EasParent, [1, 1])();

        expectCorrectForm(wageGarnishentFdf, wageGarnishmentDisputes.EasParent);
        expectContains(wageGarnishentFdf, wageGarnishmentDisputes.EasParent, ['schoolName']);

        // because dispute option is INPERSON
        expectObjectionNum(wageGarnishentFdf, '14');
        expect(wageGarnishentFdf.includes('X'), `disputeProcessCity is not selected`).true;
      });
    });
  });
});
