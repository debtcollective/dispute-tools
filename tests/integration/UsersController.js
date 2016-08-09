/* globals User, CONFIG */

const sa = require('superagent');
const agent = sa.agent();
const uuid = require('uuid');

const expect = require('chai').expect;
const Promise = require('bluebird');

const path = require('path');
const _ = require('lodash');

const truncate = require(path.join(process.cwd(), 'tests', 'utils', 'truncate'));
const url = CONFIG.env().siteURL;
const urls = CONFIG.router.helpers;

global.UserMailer = {
  sendActivation() {
    return Promise.resolve();
  },
};

describe('UsersController', () => {
  let user;

  before(() => {
    user = new User({
      email: 'user@example.com',
      password: '12345678',
      role: 'User',
    });

    return user.save();
  });

  // after(() =>
  //   truncate(User)
  // );

  it(`Should render index ${urls.Users.url()}`, (done) => {
    agent.get(`${url}${urls.Users.url()}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(err.toString()).to.be.equal('Error: Not Implemented');
        expect(res.status).to.equal(501);
        done();
      });
  });

  it(`Should render new ${urls.Users.new.url()}`, (done) => {
    agent.get(`${url}${urls.Users.new.url()}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(err).to.be.equal(null);
        expect(res.status).to.equal(200);
        done();
      });
  });

  it(`Should render show ${urls.Users.show.url(uuid.v4())}`, (done) => {
    agent.get(`${url}${urls.Users.show.url(user.id)}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(err).to.be.equal(null);
        expect(res.status).to.equal(200);
        done();
      });
  });

  it(`Should render show 404 ${urls.Users.show.url(uuid.v4())}`, (done) => {
    agent.get(`${url}${urls.Users.show.url(uuid.v4())}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(err.toString()).to.be.equal('Error: Not Found');
        expect(res.status).to.equal(404);
        done();
      });
  });
});
