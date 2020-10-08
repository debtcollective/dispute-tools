/* globals User, Dispute, DisputeTool */

const JWT = require('jsonwebtoken');
const sa = require('superagent');
const { expect } = require('chai');
const nock = require('nock');
const { execSync } = require('child_process');
const _ = require('lodash');
const qs = require('querystring');
const faker = require('faker');

const {
  router,
  siteURL,
  discourse: { baseUrl },
  sso,
} = require('$config/config');

const ids = {
  _external: 0,
  nextExternal() {
    return ++this._external;
  },
};

// mocking calls to Discourse
nock(baseUrl)
  .post('/posts')
  .query(true)
  .times(1000)
  .reply(200, (uri, body) => ({
    body,
    sent: qs.parse(uri.split('?')[1]),
    post: { topic_id: ids.nextExternal() },
  }));

const testGroups = {
  dispute_pro: {
    members: ['ann_l', 'dawn_l'],
    owners: [],
  },
  dispute_coordinator: { members: ['dawn_l'], owners: [] },
};

Object.keys(testGroups).forEach(groupName =>
  nock(baseUrl)
    .get(`/groups/${groupName}/members.json`)
    .query(true)
    .times(1000)
    .reply(200, {
      members: testGroups[groupName].members.map((username, id) => ({ username, id })),
      owners: testGroups[groupName].owners.map((username, id) => ({ username, id })),
    }),
);

const agent = sa.agent();

const withSiteUrl = url => {
  if (url.startsWith(siteURL)) {
    return url;
  }

  return `${siteURL}${url.startsWith('/') ? '' : '/'}${url}`;
};

// create objects helper
const helpers = {
  testGroups,
  truncate(...models) {
    if (models.length === 1 && Array.isArray(models[0])) {
      models = models[0];
    }

    return Promise.all(
      models.map(model => model.knex().raw(`truncate table "${model.tableName}" cascade`)),
    );
  },

  async createUser(params = {}) {
    _.defaults(params, {
      externalId: ids.nextExternal(),
      admin: false,
      email: faker.internet.email(),
      name: faker.name.findName(),
      username: faker.internet.userName(),
      avatarUrl: faker.image.imageUrl(),
    });

    const user = new User(params);

    await user.save();

    return user;
  },

  async createDispute(user, tool = null) {
    if (tool === null) {
      tool = await DisputeTool.first();
    }

    const dispute = await Dispute.createFromTool({
      user,
      disputeToolId: tool.id,
      option: tool.data.options.A ? 'A' : 'none',
    });
    dispute.disputeTool = tool;
    return dispute;
  },

  // Generate a sso cookie for user
  // we set it to cookies to be parsed by the currentUser middleware
  generateSessionFor(user) {
    const secret = sso.jwtSecret;
    const cookieName = sso.cookieName;

    // create jwt cookie
    const payload = {
      external_id: user.externalId,
      name: user.name,
      email: user.email,
      groups: [],
    };
    const token = JWT.sign(payload, secret);
    const cookie = `${cookieName}=${token}`;

    return cookie;
  },

  // Creates a session for the user
  signInAs(req, user) {
    if (user) {
      const cookie = helpers.generateSessionFor(user);

      req.set('Cookie', cookie);
    }
  },

  testGetPage: (url, user) => helpers.testGet(url, user, 'text/html'),

  testGet(url, user = null, accept = 'application/json') {
    const req = agent.get(withSiteUrl(url)).set('Accept', accept);
    helpers.signInAs(req, user);
    return req;
  },

  testPostPage: (url, body, user) => helpers.testPost(url, body, user, 'text/html'),

  testPost(url, body = null, user = null, accept = 'application/json') {
    const req = agent.post(withSiteUrl(url)).set('Accept', accept);

    if (body !== null) {
      req.send(body);
    }

    helpers.signInAs(req, user);
    return req;
  },

  testPutPage: (url, body, user) => helpers.testPut(url, body, user, 'text/html'),

  testPut(url, body = null, user = null, accept = 'application/json') {
    const req = agent.put(withSiteUrl(url)).set('Accept', accept);

    if (body !== null) {
      req.send(body);
    }

    helpers.signInAs(req, user);
    return req;
  },

  testDeletePage: (url, user) => helpers.testDelete(url, user, 'text/html'),

  testDelete(url, user = null, accept = 'application/json') {
    const req = agent.delete(withSiteUrl(url)).set('Accept', accept);
    helpers.signInAs(req, user);
    return req;
  },

  /**
   * Wraps a request meant to represent an unauthenticated
   * user's request that will be redirected. We turn off
   * redirects so that superagent doesn't try to follow through
   * to the SSO authentication endpoint.
   */
  testUnauthenticated: req =>
    req.redirects(0).catch(({ status, response: { headers } }) => {
      if (req.header.Accept === 'application/json') {
        expect(status).eq(403);
      } else {
        expect(status).eq(302);
        expect(headers.location.startsWith(router.mappings.login.url())).true;
      }
    }),

  /**
   * Only use this to test route access. If you're
   * trying to actually test whether the route does what
   * it says it does then use testOk.
   *
   * We disable redirects here because some routes (especially creates)
   * will redirect to the created resource and that will muddy up the
   * authorization test with implementation details of the route.
   */
  testAllowed: req =>
    req
      .redirects(0)
      .then(res => {
        expect(res.status).eq(200);
      })
      .catch(({ status, response: { headers } }) => {
        // Default redirect status for Express's res.redirect is a 302
        expect(status).eq(302);
        // Make sure we didn't get redirected to the login page
        expect(
          headers.location.slice(0, router.mappings.login.url().length),
          'Redirected to login',
        ).not.eq(router.mappings.login.url());
      }),

  testNoContent: req =>
    req.then(res => {
      expect(res.status).eq(204);
    }),

  testNotFound: req =>
    req.catch(res => {
      expect(res.status).eq(404);
    }),

  testOk: req =>
    req.then(res => {
      expect(res.status).eq(200);
    }),

  testForbidden: req =>
    req.catch(err => {
      expect(err.status).eq(403);
    }),

  testBadRequest: req =>
    req.catch(err => {
      expect(err.status).eq(400);
    }),

  extractPdfText: path =>
    execSync(`gs -dBATCH -dNOPAUSE -sDEVICE=txtwrite -sOutputFile=- ${path}`)
      .toString('utf-8')
      .replace(/\t/g, ' ')
      .replace(/\r\n/g, '\n'),
};

module.exports = helpers;
