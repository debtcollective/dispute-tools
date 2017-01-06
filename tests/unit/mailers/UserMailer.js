/* globals UserMailer, BaseMailer, Class, CONFIG */

const expect = require('chai').expect;
const path = require('path');

const UserMailer = require(path.join(process.cwd(), 'mailers', 'UserMailer'));

describe('UserMailer', () => {
  it('Should execute a sendActivation method', function () {
    this.timeout(5000);

    UserMailer.transport(CONFIG.env().mailers.transport);

    return UserMailer.sendActivation('success@simulator.amazonses.com', {
      user: {
        email: 'user@example.com',
        account: {
          fullname: 'User Name',
        },
      },
      _options: {
        subject: 'Activate your account - The Debt Collective',
      },
    })
    .then((response) => {
      expect(response.envelope.to[0]).to.be.equal('success@simulator.amazonses.com');
    });
  });

  it('Should execute a sendResetPasswordLink method', function () {
    this.timeout(5000);

    UserMailer.transport(CONFIG.env().mailers.transport);

    return UserMailer.sendResetPasswordLink('success@simulator.amazonses.com', {
      user: {
        email: 'user@example.com',
        account: {
          fullname: 'User Name',
        },
      },
      _options: {
        subject: 'Reset your password - The Debt Collective',
      },
    })
    .then((response) => {
      expect(response.envelope.to[0]).to.be.equal('success@simulator.amazonses.com');
    });
  });
});
