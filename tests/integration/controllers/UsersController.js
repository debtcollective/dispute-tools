/* globals User, CONFIG, Collective, Account */

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

describe('UsersController', () => {
  let user;
  let account;
  let _csrf;
  let _UserMailer;
  let collective;

  before(() => {
    _UserMailer = global.UserMailer;

    global.UserMailer = {
      sendActivation() {
        return Promise.resolve();
      },
      sendResetPasswordLink() {
        return Promise.resolve();
      },
    };

    user = new User({
      email: 'user@example.com',
      password: '12345678',
      role: 'User',
    });

    account = new Account({
      fullname: 'Users Fullname',
      state: 'Texas',
      zip: '90210',
      phone: '123456-789',
    });

    return Collective.first().then((res) => {
      collective = res;

      return User.transaction((trx) => {
        return user.transacting(trx).save()
          .then(() => {
            account.userId = user.id;
            account.collectiveId = collective.id;

            return account.transacting(trx).save();
          });
      });
    });
  });

  after(() => {
    global.UserMailer = _UserMailer;

    return truncate(User);
  });

  it(`As a Visitor, should 403 index ${urls.Users.url()}`, (done) => {
    agent.get(`${url}${urls.Users.url()}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(res.status).to.equal(403);
        done();
      });
  });

  it(`As a Visitor, should render new ${urls.Users.new.url()}`, (done) => {
    agent.get(`${url}${urls.Users.new.url()}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        _csrf = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie'])[1]);

        expect(err).to.be.equal(null);
        expect(res.status).to.equal(200);
        done();
      });
  });

  it(`As a Visitor, should render 403 on show ${urls.Users.show.url(':id')}`, (done) => {
    agent.get(`${url}${urls.Users.show.url(user.id)}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(err.toString()).to.be.equal('Error: Forbidden');
        expect(res.status).to.equal(403);
        done();
      });
  });

  // it(`Should render show 404 ${urls.Users.show.url(':id')}`, (done) => {
  //   agent.get(`${url}${urls.Users.show.url(uuid.v4())}`)
  //     .set('Accept', 'text/html')
  //     .end((err, res) => {
  //       expect(err.toString()).to.be.equal('Error: Not Found');
  //       expect(res.status).to.equal(404);
  //       done();
  //     });
  // });

  it(`As a Visitor, should render 403 on edit ${urls.Users.edit.url(':id')}`, (done) => {
    agent.get(`${url}${urls.Users.edit.url(user.id)}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(err.toString()).to.be.equal('Error: Forbidden');
        expect(res.status).to.equal(403);
        done();
      });
  });

  // it(`Should render show 404 ${urls.Users.edit.url(':id')}`, (done) => {
  //   agent.get(`${url}${urls.Users.edit.url(uuid.v4())}`)
  //     .set('Accept', 'text/html')
  //     .end((err, res) => {
  //       expect(err.toString()).to.be.equal('Error: Not Found');
  //       expect(res.status).to.equal(404);
  //       done();
  //     });
  // });

  it(`As A Visitor, should render activaton ${urls.Users.activation.url()}`, (done) => {
    agent.get(`${url}${urls.Users.activation.url()}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(err).to.be.equal(null);
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('As A Visitor it Should activate a user with a valid token', (done) => {
    agent.get(`${url}${urls.Users.activate.url(encodeURIComponent(user.activationToken))}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(err).to.be.equal(null);
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  describe('#create', () => {
    it('As a Visitor, it should create a user', (done) => {
      agent.post(`${url}${urls.Users.create.url()}`)
        .set('Accept', 'text/html')
        .send({
          email: 'test@example.com',
          password: '12345678',

          fullname: 'Users Fullname',
          state: 'Texas',
          zip: '90210',
          phone: '123456789',
          collectiveId: collective.id,
          _csrf,
        })
        .end((err, res) => {
          expect(err).to.be.equal(null);
          expect(res.status).to.be.equal(200);
          done();
        });
    });

    it('As a Visitor, it should not validate when creating a user', (done) => {
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
    it('As a Visitor, it should 403 on update a user', (done) => {
      agent.post(`${url}${urls.Users.update.url(user.id)}`)
        .set('Accept', 'text/html')
        .send({
          _method: 'PUT',
          password: '123456789',
          _csrf,
        })
        .end((err, res) => {
          expect(err.toString()).to.be.equal('Error: Forbidden');
          expect(res.status).to.be.equal(403);
          done();
        });
    });

    // it('Should not validate when updating a user', (done) => {
    //   agent.post(`${url}${urls.Users.update.url(user.id)}`)
    //     .set('Accept', 'text/html')
    //     .send({
    //       _method : 'PUT',
    //       password: '1234567',
    //       _csrf,
    //     })
    //     .end((err, res) => {
    //       expect(err.toString()).to.be.equal('Error: Bad Request');
    //       expect(res.status).to.be.equal(400);
    //       done();
    //     });
    // });
  });
});
