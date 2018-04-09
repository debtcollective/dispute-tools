const { createUser, createDispute } = require('../utils');
const personalInformation = require('../utils/form-validation-suites/personalInformation');
const ffelLoan = require('../utils/form-validation-suites/ffelLoan');
const employment = require('../utils/form-validation-suites/employment');

describe('wage garnishment dispute form validation', () => {
  let dispute;

  before(async () => {
    dispute = await createDispute(await createUser());
  });

  describe('option A', () => {
    before(() => {
      dispute.data.option = 'A';
    });

    [personalInformation, ffelLoan, employment].forEach(fn => fn(() => dispute));
  });

  describe('option B', () => {
    before(() => {
      dispute.data.option = 'B';
    });

    [personalInformation, ffelLoan, employment].forEach(fn => fn(() => dispute));
  });

  describe('option C', () => {
    before(() => {
      dispute.data.option = 'B';
    });

    [personalInformation, ffelLoan, employment].forEach(fn => fn(() => dispute));
  });

  describe('option D', () => {
    before(() => {
      dispute.data.option = 'B';
    });

    [personalInformation, ffelLoan, employment].forEach(fn => fn(() => dispute));
  });

  describe('option E', () => {
    before(() => {
      dispute.data.option = 'B';
    });

    [personalInformation, ffelLoan, employment].forEach(fn => fn(() => dispute));
  });
});
