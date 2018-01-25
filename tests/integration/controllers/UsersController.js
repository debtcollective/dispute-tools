/* globals User, CONFIG, Collective, Account, Dispute, Post */

const sa = require('superagent');
const expect = require('chai').expect;
const Promise = require('bluebird');
const path = require('path');
const uuid = require('uuid');

const { requestCSRF } = require(path.join(process.cwd(), 'tests', 'utils', 'csrf'));
const truncate = require(path.join(process.cwd(), 'tests', 'utils', 'truncate'));

const agent = sa.agent();
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
      email: `user-${uuid.v4()}@example.com`,
      password: '12345678',
      role: 'User',
    });

    account = new Account({
      fullname: 'Users Fullname',
      state: 'Texas',
      zip: '90210',
      phone: '123456-789',
    });

    return Collective.queryVisible().then(([res]) => {
      collective = res;

      return User.transaction((trx) => user.transacting(trx).save()
        .then(() => {
          account.userId = user.id;
          account.collectiveId = collective.id;

          return account.transacting(trx).save();
        }));
    });
  });

  after(() => {
    global.UserMailer = _UserMailer;

    return truncate(User);
  });

  it(`As a Visitor, should 404 index ${urls.Users.url()}`, (done) => {
    agent.get(`${url}${urls.Users.url()}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(res.status).to.equal(404);
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

  it(`As a Visitor, should render 404 on show ${urls.Users.show.url(':id')}`, (done) => {
    agent.get(`${url}${urls.Users.show.url(user.id)}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });

  it(`Should render show 404 ${urls.Users.show.url(':id')}`, (done) => {
    agent.get(`${url}${urls.Users.show.url(uuid.v4())}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });

  it(`As a Visitor, should render 404 on edit ${urls.Users.edit.url(':id')}`, (done) => {
    agent.get(`${url}${urls.Users.edit.url(user.id)}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(err.toString()).to.be.equal('Error: Not Found');
        expect(res.status).to.equal(404);
        done();
      });
  });

  it(`Should render show 404 ${urls.Users.edit.url(':id')}`, (done) => {
    agent.get(`${url}${urls.Users.edit.url(uuid.v4())}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });

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
        agent.delete(`${url}${urls.logout.url()}`)
          .set('Accept', 'text/html')
          .send({
            _csrf,
          })
          .end(() => {
            done();
          });
      });
  });

  describe('#create', () => {
    const testEmail = 'test@example.com';

    const getUserCount = function getUserCount(collectiveId) {
      return Collective.query().where('id', collectiveId)
          .then((res) => res[0].userCount);
    };

    it('As a Visitor, it should create a user', () => {
      let oldUserCount;

      return getUserCount(Collective.invisibleId)
      .then(userCount => {
        oldUserCount = userCount;

        return requestCSRF(agent)
          .then((csrf) =>
            agent.post(`${url}${urls.Users.create.url()}`)
              .set('Accept', 'text/html')
              .send({
                email: testEmail,
                password: '12345678',

                fullname: 'Users Fullname',
                state: 'Texas',
                zip: '90210',
                phone: '123456789',
                collectiveIds: [collective.id],
                _csrf: csrf,
              })
              .then(res => {
                expect(res.status).to.be.equal(200);
              })
              .then(() => getUserCount(Collective.invisibleId))
              .then((newUserCount) => {
                expect(newUserCount).to.equal(oldUserCount + 1);
              })
             .catch(err => {
               throw err;
             })
          );
      });
    });

    it('As a Visitor, it should not validate when creating a user', () =>
      requestCSRF(agent)
        .then(csrf =>
          agent.post(`${url}${urls.Users.create.url()}`)
            .set('Accept', 'text/html')
            .send({
              email: testEmail,
              password: '12345678',
              _csrf: csrf,
            })
            .catch(err => {
              expect(err.toString()).to.be.equal('Error: Bad Request');
            })
        )
    );

  });

  describe('#update', () => {
    it('As a Visitor, it should 404 on update a user', (done) => {
      agent.post(`${url}${urls.Users.update.url(user.id)}`)
        .set('Accept', 'text/html')
        .send({
          _method: 'PUT',
          password: '123456789',
          _csrf,
        })
        .end((err, res) => {
          expect(err.toString()).to.be.equal('Error: Not Found');
          expect(res.status).to.be.equal(404);
          done();
        });
    });
  });
});
