/* globals User, Account, CONFIG, Collective */

const expect = require('chai').expect;
const path = require('path');
const nock = require('nock');
const userLocationWorker = require('../../../workers/userLocationWorker');
const { createUser } = require('../../utils/helpers.js');

const truncate = require(path.join(
  process.cwd(),
  'tests',
  'utils',
  'truncate',
));

describe('userLocationWorker', () => {
  let user;

  before(() =>
    createUser({
      account: {
        fullname: 'Orlando Del Aguila',
        state: 'California',
        zip: '94115',
      },
    }).then(u => {
      user = u;
    }),
  );

  after(() => truncate([Account, User]));

  it('should update Account city and location from zip code', done => {
    const account = user.account;

    nock('https://maps.googleapis.com', {
      encodedQueryParams: true,
    })
      .get('/maps/api/geocode/json')
      .query(true)
      .replyWithFile(
        200,
        `${process.cwd()}/tests/fixtures/userLocationWorker-update-success.json`,
        ['Content-Type', 'application/json; charset=UTF-8'],
      );

    userLocationWorker(
      {
        data: {
          accountId: account.id,
        },
      },
      (err, savedAccount) => {
        expect(err).to.be.null;
        expect(savedAccount).to.not.be.null;

        expect(savedAccount.city).to.equal('San Francisco');
        expect(savedAccount.latitude).to.equal(37.7877522);
        expect(savedAccount.longitude).to.equal(-122.4382307);

        done();
      },
    );
  });

  it('should return an error if no results found', done => {
    const account = user.account;

    nock('https://maps.googleapis.com', {
      encodedQueryParams: true,
    })
      .get('/maps/api/geocode/json')
      .query(true)
      .replyWithFile(
        200,
        `${process.cwd()}/tests/fixtures/userLocationWorker-update-not-found.json`,
        ['Content-Type', 'application/json; charset=UTF-8'],
      );

    userLocationWorker(
      {
        data: {
          accountId: account.id,
        },
      },
      (err, savedAccount) => {
        expect(err).to.not.be.null;
        expect(savedAccount).to.be.null;

        done();
      },
    );
  });
});
