/* globals UserMailer, BaseMailer, Class, CONFIG */

const expect = require('chai').expect;
const path = require('path');

const UserMailer = require(path.join(process.cwd(), 'mailers', 'UserMailer'));

describe('UserMailer', () => {
  it('Should execute a sendActivation method', () => {
    UserMailer.transport(CONFIG.env().mailers.transport);

    return UserMailer.sendActivation('success@simulator.amazonses.com', {
      user: {
        email: 'user@example.com',
      },
      _options: {
        subject: 'Activate your account - The Debt Collective',
      },
    })
    .then((response) => {
      expect(response.envelope.to[0]).to.be.equal('success@simulator.amazonses.com');
    });
  });
});
