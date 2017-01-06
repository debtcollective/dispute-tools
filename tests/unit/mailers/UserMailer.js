/* globals UserMailer, BaseMailer, Class, CONFIG */

const expect = require('chai').expect;
const path = require('path');

const UserMailer = require(path.join(process.cwd(), 'mailers', 'UserMailer'));

describe('UserMailer', () => {
  xit('Should execute a sendActivation method', () => {
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
      console.log('BUG: THIS IS CALLED BUT THE TEST IS NOT BEING DONE');
      expect(response.envelope.to[0]).to.be.equal('success@simulator.amazonses.com');
    });
  });

  xit('Should execute a sendResetPasswordLink method', () => {
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
      console.log('BUG: THIS IS CALLED BUT THE TEST IS NOT BEING DONE');
      expect(response.envelope.to[0]).to.be.equal('success@simulator.amazonses.com');
    });
  });
});
