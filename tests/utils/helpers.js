/* globals CONFIG, User, Dispute, DisputeTool */
const uuid = require('uuid');
const sso = require('../../services/sso');
const sa = require('superagent');

const { siteURL } = CONFIG.env();

const agent = sa.agent();

const ids = {
  _external: 0,
  nextExternal() {
    return ++ids._external;
  },
};

const cookieCache = {};

const withSiteUrl = url => {
  if (url.startsWith(siteURL)) {
    return url;
  }

  return `${siteURL}${url.startsWith('/') ? '' : '/'}${url}`;
};

// create objects helper
const helpers = {
  async createUser({
    params = { externalId: ids.nextExternal() },
    groups = [],
    admin = false,
    moderator = false,
  } = {}) {
    const user = new User(params);

    await user.save();

    return user.setInfo({
      groups,
      admin,
      moderator,
      email: `${uuid.v4()}@example.com`,
      username: uuid.v4(),
    });
  },

  getUserCookie(user) {
    const exists = cookieCache[JSON.stringify(user)];
    if (exists) return exists;

    const ret = {};
    sso.createCookie(
      { user },
      { cookie: (name, cookie, config) => Object.assign(ret, { name, cookie, config }) },
      () => {},
    );

    cookieCache[JSON.stringify(user)] = ret;
    return ret;
  },

  createDispute(user) {
    return DisputeTool.first().then(tool =>
      tool
        .createDispute({
          user,
          option: tool.data.options.A ? 'A' : 'none',
        })
        .then(disputeId => Dispute.query().where('id', disputeId)),
    );
  },

  setCookie(req, user) {
    if (user) {
      const { name, cookie } = helpers.getUserCookie(user);
      req.set('Cookie', `${name}=${cookie}`);
    } else {
      req.set('Cookie', null);
    }
  },

  testGetPage: (url, user) => helpers.testGet(url, user, 'text/html'),

  testGet(url, user = null, accept = 'application/json') {
    const req = agent.get(withSiteUrl(url)).set('Accept', accept);
    helpers.setCookie(req, user);
    return req;
  },

  testPostPage: (url, body, user) => helpers.testPost(url, body, user, 'text/html'),

  testPost(url, body = {}, user = null, accept = 'application/json') {
    const req = agent
      .post(withSiteUrl(url))
      .set('Accept', accept)
      .send(body);
    helpers.setCookie(req, user);
    return req;
  },

  testPutPage: (url, body, user) => helpers.testPut(url, body, user, 'text/html'),

  testPut(url, body = {}, user = null, accept = 'application/json') {
    const req = agent
      .put(withSiteUrl(url))
      .set('Accept', accept)
      .send(body);
    helpers.setCookie(req, user);
    return req;
  },

  testDeletePage: (url, user) => helpers.testDelete(url, user, 'text/html'),

  testDelete(url, user = null, accept = 'application/json') {
    const req = agent.delete(withSiteUrl(url)).set('Accept', accept);
    helpers.setCookie(req, user);
    return req;
  },
};

module.exports = helpers;
