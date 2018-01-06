/* eslint-disable max-len */

const { expect } = require('chai');
const { render } = require('../../../services/render');
const {
  generalDebtDispute,
  studentDebtDispute,
  privateStudentLoanDispute,
  creditReportDispute,
  taxOffsetReview_a,
  taxOffsetReview_b,
  taxOffsetReview_c,
  taxOffsetReview_d,
  taxOffsetReview_e,
} = require('../../utils/sampleDisputeData');

function basicRenderTest(sampleData, docTemplates = [1], timeout = 5000) {
  return async function theTest() {
    this.timeout(timeout);
    const files = await render(sampleData);
    expect(files.length).to.eq(docTemplates.length);
    files.forEach((doc, i) => {
      expect(doc.length).to.eq(docTemplates[i]);
      doc.forEach(template => expect(template.rendered).to.be.defined);
    });
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
    describe('tax offset review', () => {
      it('a: should render the pdf', basicRenderTest(taxOffsetReview_a));

      it('b: should render the pdf', basicRenderTest(taxOffsetReview_b));

      it('c: should render the pdfs', basicRenderTest(taxOffsetReview_c, [1, 1]));

      it('d: should render the pdfs', basicRenderTest(taxOffsetReview_d, [1, 1]));

      it('e: should render the pdfs', basicRenderTest(taxOffsetReview_e, [1, 1]));
    });
  });

  describe('graphicsmagick', async () => {
    it('should render the pdf', basicRenderTest(studentDebtDispute, [6], 10000));
  });
});
