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
  let _csrf;

  before(() => {
    user = new User({
      email: 'user@example.com',
      password: '12345678',
      role: 'User',
    });

    return user.save();
  });

  after(() =>
    truncate(User)
  );

  it(`Should render index ${urls.Users.url()}`, (done) => {
    agent.get(`${url}${urls.Users.url()}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        _csrf = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie'])[1]);

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

  it(`Should render show ${urls.Users.show.url(':id')}`, (done) => {
    agent.get(`${url}${urls.Users.show.url(user.id)}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(err).to.be.equal(null);
        expect(res.status).to.equal(200);
        done();
      });
  });

  it(`Should render show 404 ${urls.Users.show.url(':id')}`, (done) => {
    agent.get(`${url}${urls.Users.show.url(uuid.v4())}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(err.toString()).to.be.equal('Error: Not Found');
        expect(res.status).to.equal(404);
        done();
      });
  });

  it(`Should render edit ${urls.Users.edit.url(':id')}`, (done) => {
    agent.get(`${url}${urls.Users.edit.url(user.id)}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(err).to.be.equal(null);
        expect(res.status).to.equal(200);
        done();
      });
  });

  it(`Should render show 404 ${urls.Users.edit.url(':id')}`, (done) => {
    agent.get(`${url}${urls.Users.edit.url(uuid.v4())}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(err.toString()).to.be.equal('Error: Not Found');
        expect(res.status).to.equal(404);
        done();
      });
  });

  it(`Should render activaton ${urls.Users.activation.url()}`, (done) => {
    agent.get(`${url}${urls.Users.activation.url()}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(err).to.be.equal(null);
        expect(res.status).to.equal(200);
        done();
      });
  });

  describe('#create', () => {
    it('Should create a user', (done) => {
      agent.post(`${url}${urls.Users.create.url()}`)
        .set('Accept', 'text/html')
        .send({
          email: 'test@example.com',
          password: '12345678',
          _csrf,
        })
        .end((err, res) => {
          expect(err).to.be.equal(null);
          expect(res.status).to.be.equal(200);
          done();
        });
    });

    it('Should not validate when creating a user', (done) => {
      agent.post(`${url}${urls.Users.create.url()}`)
        .set('Accept', 'text/html')
        .send({
          email: 'test@example.com',
          password: '12345678',
          _csrf,
        })
        .end((err, res) => {
          expect(err.toString()).to.be.equal('Error: Bad Request');
          expect(res.status).to.be.equal(400);
          done();
        });
    });
  });

  describe('#update', () => {
    it('Should update a user', (done) => {
      agent.post(`${url}${urls.Users.update.url(user.id)}`)
        .set('Accept', 'text/html')
        .send({
          _method : 'PUT',
          password: '123456789',
          _csrf,
        })
        .end((err, res) => {
          expect(err).to.be.equal(null);
          expect(res.status).to.be.equal(200);
          done();
        });
    });

    it('Should not validate when updating a user', (done) => {
      agent.post(`${url}${urls.Users.update.url(user.id)}`)
        .set('Accept', 'text/html')
        .send({
          _method : 'PUT',
          password: '1234567',
          _csrf,
        })
        .end((err, res) => {
          expect(err.toString()).to.be.equal('Error: Bad Request');
          expect(res.status).to.be.equal(400);
          done();
        });
    });
  });
});
