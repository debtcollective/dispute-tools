/* globals User, CONFIG */

const sa = require('superagent');
const expect = require('chai').expect;

const agent = sa.agent();
const url = CONFIG.env().siteURL;
const urls = CONFIG.router.helpers;

describe('ACLController', () => {
  it('Should return a object with Resources and capabilities', (done) => {
    agent.get(`${url}${urls.acl.url()}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.root).to.be.instanceof(Object);
        expect(res.body.root.index).to.be.instanceof(Object);
        expect(res.body.root.index.path).to.be.equal('/');
        done();
      });
  });
});
