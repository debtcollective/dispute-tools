const DisputeTool = require('../../models/DisputeTool');

const { createUser, createDispute } = require('../utils');
const personalInformation = require('../utils/form-validation-suites/personalInformation');
const yourSchool = require('../utils/form-validation-suites/yourSchool');
const ffelLoan = require('../utils/form-validation-suites/ffelLoan');
const employment = require('../utils/form-validation-suites/employment');
const atbFalseCert = require('../utils/form-validation-suites/atbFalseCertification');
const atbDisqualifyingStatus = require('../utils/form-validation-suites/atbDisqualifyingStatus');
const unauthorizedSignature = require('../utils/form-validation-suites/unauthorizedSignature');

describe('wage garnishment dispute form validation', () => {
  let dispute;

  before(async () => {
    dispute = await createDispute(
      await createUser(),
      await DisputeTool.findById('11111111-1111-1111-1111-111111111111'),
    );
  });

  describe('option A', () => {
    before(() => {
      dispute.data.option = 'A';
    });

    [personalInformation, yourSchool, ffelLoan, employment].forEach(fn => fn(() => dispute));
  });

  describe('option B', () => {
    before(() => {
      dispute.data.option = 'B';
    });

    [personalInformation, yourSchool, ffelLoan, employment].forEach(fn => fn(() => dispute));
  });

  describe('option C', () => {
    before(() => {
      dispute.data.option = 'C';
    });

    [personalInformation, yourSchool, ffelLoan, employment, atbFalseCert].forEach(fn =>
      fn(() => dispute),
    );
  });

  describe('option D', () => {
    before(() => {
      dispute.data.option = 'D';
    });

    [personalInformation, yourSchool, ffelLoan, employment, atbDisqualifyingStatus].forEach(fn =>
      fn(() => dispute),
    );
  });

  describe('option E', () => {
    before(() => {
      dispute.data.option = 'E';
    });

    [personalInformation, yourSchool, ffelLoan, employment, unauthorizedSignature].forEach(fn =>
      fn(() => dispute),
    );
  });
});
