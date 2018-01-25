/* globals User, Account, CONFIG, Collective */

const expect = require('chai').expect;
const path = require('path');

const truncate = require(path.join(
  process.cwd(),
  'tests',
  'utils',
  'truncate',
));

describe('Collective', () => {
  after(() => truncate([Account, User]));

  const listIds = function listIds(queryResult) {
    return queryResult.map(collective => collective.id);
  };

  describe('queryVisible', () => {
    it('should filter out the invisible collective', () =>
      Collective.queryVisible().then(res =>
        expect(listIds(res)).to.not.include(Collective.invisibleId),
      ));
  });

  describe('query', () => {
    it('should not filter out the invisible collective', () =>
      Collective.query().then(res =>
        expect(listIds(res)).to.include(Collective.invisibleId),
      ));
  });

  describe('Validations', () => {});
  describe('Relations', () => {});
});
