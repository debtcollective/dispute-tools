/* globals CONFIG, Collective */
const sa = require('superagent');
const expect = require('chai').expect;

const url = CONFIG.env().siteURL;
const urls = CONFIG.router.helpers;

describe('CollectivesController', () => {
  let agent;

  beforeEach(() => {
    agent = sa.agent();
  });

  describe('#index', () => {
    it('should not show the invisible collective', () =>
      agent.get(`${url}${urls.Collectives.url()}`)
        .then(result => {
          expect(result.text).to.have.string('Solidarity Bloc');
          expect(result.text).to.not.have.string(Collective.invisibleId);
        })
      );
  });
});
