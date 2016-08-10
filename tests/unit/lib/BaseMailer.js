/* globals  BaseMailer, FooMailer, Class */

const expect = require('chai').expect;
const Promise = require('bluebird');

const path = require('path');
const _ = require('lodash');

describe('BaseMailer', () => {
  const mailResponse = {
    sent: 'ok',
  };

  const transport = {
    sendMail() {
      return Promise.resolve(mailResponse);
    },
  };

  beforeEach((done) => {
    Class('FooMailer').inherits(BaseMailer)({
      sendBarBaz(...args) {
        return this._send('sendBarBaz', ...args);
      },
    });

    BaseMailer._transport = null;
    FooMailer._transport = null;

    BaseMailer._layout = null;
    done();
  });

  it('Should set the transport static property', (done) => {
    FooMailer.transport(transport);

    expect(FooMailer.transport()).to.be.equal(transport);
    done();
  });

  it('Should get the transport from an ancestor', (done) => {
    BaseMailer.transport(transport);

    expect(FooMailer.transport()).to.be.equal(transport);
    done();
  });

  it('Should fail if there is no transport set', (done) => {
    expect(() => FooMailer.transport())
      .to.throw('FooMailer can\'t find a nodemailer transport');
    done();
  });

  it('Should the set the layout property', (done) => {
    BaseMailer.layout('TestMailer');

    expect(BaseMailer.layout()).to.be.equal(path.join(
      process.cwd(),
      'views',
      'mailers',
      'layouts',
      'TestMailer.pug'
    ));
    done();
  });

  it('Should the get the conventional layout', (done) => {
    expect(BaseMailer.layout()).to.be.equal(path.join(
      process.cwd(),
      'views',
      'mailers',
      'layouts',
      'BaseMailer.pug'
    ));
    done();
  });

  it('Should not return null if there is no layout', (done) => {
    expect(FooMailer.layout()).to.be.equal(null);
    done();
  });

  it('Should set a custom method template', (done) => {
    FooMailer.setMethodTemplate('sendBarBaz', 'test');

    expect(FooMailer._templates.sendBarBaz.template).to.be.equal(path.join(
      process.cwd(),
      'views',
      'mailers',
      'FooMailer',
      'test.pug'
    ));
    done();
  });

  it('Should set a custom method template and layout', (done) => {
    FooMailer._templates = null;

    FooMailer.setMethodTemplate('sendBarBaz', 'test', 'TestMailer');

    expect(FooMailer._templates.sendBarBaz.template).to.be.equal(path.join(
      process.cwd(),
      'views',
      'mailers',
      'FooMailer',
      'test.pug'
    ));

    expect(FooMailer._templates.sendBarBaz.layout).to.be.equal(path.join(
      process.cwd(),
      'views',
      'mailers',
      'layouts',
      'TestMailer.pug'
    ));
    done();
  });

  it('Should execute a sender method', () => {
    FooMailer.transport(transport);

    return FooMailer.sendBarBaz('user@example.com', {
      user: {
        email: 'user@example.com',
      },
    }).then((response) => {
      expect(response).to.be.equal(mailResponse);
    });
  });
});
