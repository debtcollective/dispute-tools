const DisputeTool = require('../../models/DisputeTool');

const { createUser, createDispute } = require('../utils');
const personalInformation = require('../utils/form-validation-suites/personalInformation');
const ffelLoan = require('../utils/form-validation-suites/ffelLoan');
const yourSchool = require('../utils/form-validation-suites/yourSchool');
const atbFalseCert = require('../utils/form-validation-suites/atbFalseCertification');
const atbDisqualifyingStatus = require('../utils/form-validation-suites/atbDisqualifyingStatus');
const unauthorizedSignature = require('../utils/form-validation-suites/unauthorizedSignature');

describe('tax offset review dispute form validation', () => {
  let dispute;

  before(async () => {
    dispute = await createDispute(
      await createUser(),
      await DisputeTool.findById('11111111-1111-2222-1111-111111111111'),
    );
    dispute.data.option = 'none';
  });

  describe('option A', () => {
    before(() => {
      dispute.data.option = 'A';
    });

    [personalInformation, yourSchool, ffelLoan].forEach(fn => fn(() => dispute));
  });

  describe('option B', () => {
    before(() => {
      dispute.data.option = 'B';
    });

    [personalInformation, yourSchool, ffelLoan].forEach(fn => fn(() => dispute));
  });

  describe('option C', () => {
    before(() => {
      dispute.data.option = 'C';
    });

    [personalInformation, yourSchool, ffelLoan, atbFalseCert].forEach(fn => fn(() => dispute));
  });

  describe('option D', () => {
    before(() => {
      dispute.data.option = 'D';
    });

    [personalInformation, yourSchool, ffelLoan, atbDisqualifyingStatus].forEach(fn =>
      fn(() => dispute),
    );
  });

  describe('option E', () => {
    before(() => {
      dispute.data.option = 'E';
    });

    [personalInformation, yourSchool, ffelLoan, unauthorizedSignature].forEach(fn =>
      fn(() => dispute),
    );
  });
});
