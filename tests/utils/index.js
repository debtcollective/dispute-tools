/* globals User, Dispute, DisputeTool */

const uuid = require('uuid');
const sa = require('superagent');
const { expect } = require('chai');
const { execSync } = require('child_process');
const _ = require('lodash');

// used to mock sessions
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const cookieSignature = require('cookie-signature');
const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
});

const redisStoreInstance = new RedisStore({
  client: redisClient,
});

const { sessions, router, siteURL } = require('$config/config');

const agent = sa.agent();

const ids = {
  _external: 0,
  nextExternal() {
    return ++this._external;
  },
};

const withSiteUrl = url => {
  if (url.startsWith(siteURL)) {
    return url;
  }

  return `${siteURL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const testGroups = {
  dispute_pro: {
    members: ['ann_l', 'dawn_l'],
    owners: [],
  },
  dispute_coordinator: { members: ['dawn_l'], owners: [] },
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
      email: `${uuid.v4()}@example.com`,
      username: uuid.v4(),
      avatarUrl: '{size}',
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

  // Generate a session for user
  // express-session just stores a session id in the cookie
  // so we need to create both a session and a cookie
  generateSessionFor(user) {
    const sessionID = uuid.v4();
    const name = sessions.key;
    const secret = sessions.secret;
    const cookie = new expressSession.Cookie();
    const session = {
      passport: {
        user: user.id,
      },
      cookie,
    };

    // create session
    redisStoreInstance.set(sessionID, session, _.noop);

    // create cookie
    const signed = `s:${cookieSignature.sign(sessionID, secret)}`;
    const cookieData = cookie.serialize(name, signed, cookie.options);

    return cookieData;
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
