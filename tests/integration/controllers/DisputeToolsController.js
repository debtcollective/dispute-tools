/* globals CONFIG, DisputeTool, User, Account */

const expect = require('chai').expect;
const { createUser, testGetPage } = require('../../utils/helpers');

const { sso: { endpoint } } = CONFIG.env();
const urls = CONFIG.router.helpers;

describe('DisputeToolsController', () => {
  describe('authorization', () => {
    let user;
    let admin;
    let moderator;

    before(async () => {
      user = await createUser();
      admin = await createUser({ admin: true });
      moderator = await createUser({ moderator: true });
    });

    describe('index', () => {
      const index = urls.DisputeTools.url();
      describe('unauthenticated', () => {
        it('should allow', () =>
          testGetPage(index).then(res => {
            expect(res.status).eq(200);
          }));
      });

      describe('unprivileged', () => {
        it('should allow', () =>
          testGetPage(index, user).then(res => {
            expect(res.status).eq(200);
          }));
      });

      describe('admin', () => {
        it('should allow', () =>
          testGetPage(index, admin).then(res => {
            expect(res.status).eq(200);
          }));
      });

      describe('moderator', () => {
        it('should allow', () =>
          testGetPage(index, moderator).then(res => {
            expect(res.status).eq(200);
          }));
      });
    });

    describe('tool page', () => {
      let url;

      before(async () => {
        const tool = await DisputeTool.first();
        url = urls.DisputeTools.show.url(tool.id);
      });

      describe('unauthenticated', () => {
        it.skip('should redirect to sso', () =>
          // Need some way to catch the sso redirect...
          testGetPage(url).then(res => {
            expect(res.status).eq(200);
            expect(res.redirects.length).eq(1);
            expect(res.redirects[0]).eq(endpoint);
          }));
      });

      describe('unprivileged', () => {
        it('should allow', () =>
          testGetPage(url, user).then(res => {
            expect(res.status).eq(200);
            expect(res.redirects.length).eq(0);
          }));
      });

      describe('admin', () => {
        it('should allow', () =>
          testGetPage(url, admin).then(res => {
            expect(res.status).eq(200);
            expect(res.redirects.length).eq(0);
          }));
      });

      describe('moderator', () => {
        it('should allow', () =>
          testGetPage(url, moderator).then(res => {
            expect(res.status).eq(200);
            expect(res.redirects.length).eq(0);
          }));
      });
    });
  });

  // it('Should redirect to login when accessing a tool if not logged in', done => {
  //   DisputeTool.first().then(tool => {
  //     agent
  //       .get(`${url}${urls.DisputeTools.show.url(tool.id)}`)
  //       .set('Accept', 'text/html')
  //       .end((err, res) => {
  //         expect(res.status).to.equal(200);
  //         expect(res.redirects.length).to.be.equal(1);
  //         expect(res.redirects[0]).to.have.string('/login');
  //         done();
  //       });
  //   });
  // });

  // it('Should render the show view when logged in', done => {
  //   agent
  //     .post(`${url}${urls.login.url()}`)
  //     .set('Accept', 'text/html')
  //     .send({
  //       email: user.email,
  //       password: '12345678',
  //     })
  //     .end(() => {
  //       DisputeTool.first().then(tool => {
  //         agent
  //           .get(`${url}${urls.DisputeTools.show.url(tool.id)}`)
  //           .set('Accept', 'text/html')
  //           .end((err, res) => {
  //             expect(res.status).to.equal(200);
  //             expect(res.redirects.length).to.be.equal(0);
  //             expect(res.req.path).to.be.equal(urls.DisputeTools.show.url(tool.id));
  //             done();
  //           });
  //       });
  //     });
  // });

  // it('Should render the show view for disputes with no options', () => {
  //   // Tools have fixed ids
  //   // 11111111-1111-3333-1111-111111111111 == Dispute Any Debt in Collections
  //   const toolId = '11111111-1111-3333-1111-111111111111';

  //   return agent
  //     .get(`${url}${urls.DisputeTools.show.url(toolId)}`)
  //     .set('Accept', 'text/html')
  //     .then(res => {
  //       expect(res.status).to.equal(200);
  //       expect(res.redirects.length).to.be.equal(0);
  //       expect(res.req.path).to.be.equal(urls.DisputeTools.show.url(toolId));
  //     });
  // });
});
