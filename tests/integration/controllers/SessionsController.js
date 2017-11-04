/* globals User, CONFIG, Collective, Account */
const sa = require('superagent');
const bcrypt = require('bcrypt-node');
const path = require('path');

const agent = sa.agent();

const expect = require('chai').expect;


const truncate = require(path.join(process.cwd(), 'tests', 'utils', 'truncate'));
const url = CONFIG.env().siteURL;
const urls = CONFIG.router.helpers;

describe('SessionsController', () => {
  let user;
  let _csrf;
  let _UserMailer;

  before(function before() {
    this.timeout(10000);

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

    const account = new Account({
      fullname: 'Example Account Name',
      bio: '',
      state: 'Texas',
      zip: '73301',
    });

    return Collective.first().then((res) => User.transaction((trx) => user.transacting(trx).save()
          .then(() => user.transacting(trx).activate().save())
          .then(() => {
            account.userId = user.id;
            account.collectiveId = res.id;
            return account.transacting(trx).save();
          })));
  });

  after(() => {
    global.UserMailer = _UserMailer;

    return truncate(User);
  });

  it('Should render the login form', (done) => {
    agent.get(`${url}${urls.login.url()}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        _csrf = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie'])[1]);

        expect(err).to.be.equal(null);
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  it('Should login with existing credentials', (done) => {
    agent.post(`${url}${urls.login.url()}`)
      .set('Accept', 'text/html')
      .send({
        email: user.email,
        password: '12345678',
        _csrf,
      })
      .end((err, res) => {
        expect(err).to.be.equal(null);
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  it('Should fail login with invalid credentials', (done) => {
    const _agent = sa.agent();

    _agent.get(`${url}${urls.login.url()}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        _csrf = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie'])[1]);

        _agent.post(`${url}${urls.login.url()}`)
          .set('Accept', 'text/html')
          .send({
            email: user.email,
            password: '123456',
            _csrf,
          })
          .end((badRequestErr, badRequestRes) => {
            expect(badRequestErr.toString()).to.be.equal('Error: Bad Request');
            expect(badRequestRes.status).to.be.equal(400);
            done();
          });
      });
  });

  it('Should logout a logged in user', (done) => {
    agent.get(`${url}${urls.login.url()}`)
      .set('Accept', 'text/html')
      .end((err, res) => {
        _csrf = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie'])[1]);

        agent.delete(`${url}${urls.logout.url()}`)
          .set('Accept', 'text/html')
          .send({
            _csrf,
          })
          .end((err, res) => {
            expect(err).to.be.equal(null);
            expect(res.status).to.be.equal(200);
            done();
          });
      });
  });

  it('Should show the enter your email to reset password form', (done) => {
    agent.get(`${url}${urls.resetPassword.url()}`)
    .set('Accept', 'text/html')
    .end((err, res) => {
      expect(err).to.be.equal(null);
      expect(res.status).to.be.equal(200);
      done();
    });
  });

  it('Should accept a valid email to reset the password', function handler(done) {
    this.timeout(10000);

    agent.post(`${url}${urls.resetPassword.url()}`)
    .send({
      _csrf,
      email: user.email,
    })
    .set('Accept', 'text/html')
    .end((err, res) => {
      expect(err).to.be.equal(null);
      expect(res.status).to.be.equal(200);
      done();
    });
  });

  it('Should fail if the email to reset the password is invalid', (done) => {
    agent.post(`${url}${urls.resetPassword.url()}`)
    .send({
      _csrf,
      email: 'invalid@example.com',
    })
    .set('Accept', 'text/html')
    .end((err, res) => {
      expect(err.toString()).to.be.equal('Error: Bad Request');
      expect(res.status).to.be.equal(400);
      done();
    });
  });

  it('Should show the form to enter the new password if a valid token is provided', (done) => {
    User.query().where('email', user.email)
      .then((result) => {
        agent.get(`${url}${urls.resetPasswordWithToken.url(encodeURIComponent(result[0].resetPasswordToken))}`)
        .set('Accept', 'text/html')
        .end((err, res) => {
          _csrf = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie'])[1]);
          expect(err).to.be.equal(null);
          expect(res.status).to.be.equal(200);
          done();
        });
      });
  });

  it('Should update the user password', function handler(done) {
    this.timeout(5000);

    User.query().where('email', user.email)
      .then((result) => {
        agent.put(`${url}${urls.resetPasswordWithToken.url(encodeURIComponent(result[0].resetPasswordToken))}`)
        .send({
          password: '87654321',
          confirmPassword: '87654321',
          _csrf,
        })
        .set('Accept', 'text/html')
        .end((err, res) => {
          expect(err).to.be.equal(null);
          expect(res.status).to.be.equal(200);
          User.query()
            .where('email', user.email)
            .then((_user) => {
              bcrypt.compare('87654321', _user[0].encryptedPassword, (err, valid) => {
                expect(err).to.be.equal(null);
                expect(valid).to.be.equal(true);
                done();
              });
            });
        });
      });
  });

  it('Should fail update the user passwords mismatch', function handler(done) {
    this.timeout(5000);

    User.query().where('email', user.email)
      .then((result) => {
        agent.put(`${url}${urls.resetPasswordWithToken.url(encodeURIComponent(result[0].resetPasswordToken))}`)
        .send({
          password: '87654321',
          confirmPassword: '8765432',
          _csrf,
        })
        .set('Accept', 'text/html')
        .end((err, res) => {
          expect(err.toString()).to.be.equal('Error: Bad Request');
          expect(res.status).to.be.equal(400);
          done();
        });
      });
  });

  it('Should fail update the user password does not validate', function handler(done) {
    this.timeout(5000);

    User.query().where('email', user.email)
      .then((result) => {
        agent.put(`${url}${urls.resetPasswordWithToken.url(encodeURIComponent(result[0].resetPasswordToken))}`)
        .send({
          password: '8765432',
          confirmPassword: '8765432',
          _csrf,
        })
        .set('Accept', 'text/html')
        .end((err, res) => {
          expect(err.toString()).to.be.equal('Error: Bad Request');
          expect(res.status).to.be.equal(400);
          done();
        });
      });
  });
});
