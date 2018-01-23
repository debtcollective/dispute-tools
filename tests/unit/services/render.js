const pdftk = require('node-pdftk');
const { expect } = require('chai');
const { render } = require('../../../services/render');
const {
  generalDebtDispute,
  privateStudentLoanDispute,
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
        doc.forEach(template => expect(template.rendered).to.be.defined);
        return pdftk
          .input(doc[0].rendered)
          .generateFdf()
          .output();
      }),
    );
  };
}

describe('render', () => {
  describe('pug', () => {
    describe('general debt dispute', () => {
      it('should render the pdf', basicRenderTest(generalDebtDispute));
    });

    describe('private student debt dispute', () => {
      it('should render the pdf', basicRenderTest(privateStudentLoanDispute));
    });

    describe('credit report dispute letter', () => {
      it('should render the pdf', basicRenderTest(creditReportDispute, [2]));
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

    const expectObjectionNum = (fdf, num) => expect(fdf.includes(num), `the objection number ${num} is not marked correctly`).true
    
    const expectContains = (fdf, testData, keys, prefix = '') => {
      const formData = testData.data.forms['personal-information-form'];
      keys.forEach(key => {
        const pkey = prefix + key;
        if (formData[pkey]) {
          expect(fdf.includes(formData[pkey]), `generated pdf does not contain ${pkey} (${formData[pkey]})`).true;
        }
      });
    };

    const expectCorrectLoanDischargeApplication = (fdf, form, supplementalPrefix) => {
      expectContains(fdf, form, personalInfoKeys);
      expectContains(fdf, form, schoolInfoKeys, 'school');
      expectContains(fdf, form, supplementalKeys, supplementalPrefix);
    };

    describe('tax offset review', () => {
      it('a: should render the pdf', async () => {
        const fdfs = await basicRenderTest(taxOffsetReviews.A, [1])();

        expectContains(fdfs[0], taxOffsetReviews.A, personalInfoKeys.concat(['ssn']));
      });

      it('b: should render the pdf', async () => {
        const fdfs = await basicRenderTest(taxOffsetReviews.B, [1])();

        expectContains(fdfs[0], taxOffsetReviews.B, personalInfoKeys.concat(['ssn']));

        // because dispute option is INPERSON
        expectContains(fdfs[0], taxOffsetReviews.B, ['phone']);
        expectObjectionNum(fdfs[0], '7')
      });

      it.skip('c: should render the pdf', async () => {
        // https://gitlab.com/debtcollective/debtcollective/issues/308
        const fdfs = await basicRenderTest(taxOffsetReviews.C, [1, 1])();

        expectContains(fdfs[0], taxOffsetReviews.C, personalInfoKeys.concat(['schoolName', 'ssn']));
        expectCorrectLoanDischargeApplication(fdfs[1], taxOffsetReviews.C, 'atb-');
      });

      it('d: should render the pdf', async () => {
        const fdfs = await basicRenderTest(taxOffsetReviews.D, [1, 1])();

        expectContains(fdfs[0], taxOffsetReviews.D, personalInfoKeys.concat(['schoolName', 'ssn']));

        // because dispute option is BYPHONE
        expectContains(fdfs[0], taxOffsetReviews.D, ['phone']);
        expectObjectionNum(fdfs[0], '11')

        expectCorrectLoanDischargeApplication(fdfs[1], taxOffsetReviews.D, 'atbd-');
      });

      it.skip('e: should render the pdf', async () => {
        // https://gitlab.com/debtcollective/debtcollective/issues/308
        const fdfs = await basicRenderTest(taxOffsetReviews.E, [1, 1])();

        expectContains(fdfs[0], taxOffsetReviews.E, personalInfoKeys.concat(['schoolName', 'ssn']));

        // because dispute option is INPERSON
        expectContains(fdfs[0], taxOffsetReviews.E, ['phone']);
        expectObjectionNum(fdfs[0], '12')

        expectCorrectLoanDischargeApplication(fdfs[1], taxOffsetReviews.E, 'fc-');
      });
    });

    describe('wage garnishment dispute', () => {
      const expectCorrectForm = (fdf, form) => {
        expectContains(fdf, form, personalInfoKeys.concat(['ssn']));
        expectContains(fdf, form, employmentInfoKeys, 'employ');
      };

      it('a: should render the pdf', async () => {
        const fdfs = await basicRenderTest(wageGarnishmentDisputes.A, [1])();

        expectCorrectForm(fdfs[0], wageGarnishmentDisputes.A);
      });

      it('b: should render the pdf', async () => {
        const fdfs = await basicRenderTest(wageGarnishmentDisputes.B, [1])();

        expectCorrectForm(fdfs[0], wageGarnishmentDisputes.B);

        // because dispute option is INPERSON
        expectObjectionNum(fdfs[0], '10')
        expect(fdfs[0].includes('X'), `disputeProcessCity is not selected`).true;
      });

      it('c: should render the pdf', async () => {
        const fdfs = await basicRenderTest(wageGarnishmentDisputes.C, [1, 1])();

        expectCorrectForm(fdfs[0], wageGarnishmentDisputes.C);
      });

      it('d: should render the pdf', async () => {
        const fdfs = await basicRenderTest(wageGarnishmentDisputes.D, [1, 1])();

        expectCorrectForm(fdfs[0], wageGarnishmentDisputes.D);
        expectContains(fdfs[0], wageGarnishmentDisputes.D, ['schoolName']);

        // because dispute option is BYPHONE
        expectContains(fdfs[0], wageGarnishmentDisputes.D, ['phone']);
        expectObjectionNum(fdfs[0], '12')
      });

      it('e: should render the pdf', async () => {
        const fdfs = await basicRenderTest(wageGarnishmentDisputes.E, [1, 1])();

        expectCorrectForm(fdfs[0], wageGarnishmentDisputes.E);
        expectContains(fdfs[0], wageGarnishmentDisputes.E, ['schoolName']);

        // because dispute option is INPERSON
        expectObjectionNum(fdfs[0], '14')
        expect(fdfs[0].includes('X'), `disputeProcessCity is not selected`).true;
      });
    });
  });
});
