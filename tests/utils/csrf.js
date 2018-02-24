/* globals CONFIG, User, Account, Dispute, DisputeTool */
const url = CONFIG.env().siteURL;
const urls = CONFIG.router.helpers;

const getCSRF = res =>
  // just string manipulation of an HTTP result
  unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie'])[1]);

const requestCSRF = agent =>
  // actually requests a new response from server, then calls getCSRF
  // agent as in superagent.agent()

  agent
    .get(`${url}`)
    .set('Accept', 'text/html')
    .then(res => getCSRF(res));

const signInAs = (user, agent) =>
  // assumes password '12345678'; returns csrf token

  requestCSRF(agent).then(csrf =>
    agent
      .post(`${url}${urls.login.url()}`)
      .set('Accept', 'text/html')
      .send({
        email: user.email,
        password: '12345678',
        _csrf: csrf,
      })
      .then(postResult => getCSRF(postResult))
      .catch(err => {
        throw new Error(`Error while logging in: ${err.stack}`);
      }),
  );

// create objects helper
module.exports = {
  getCSRF,
  requestCSRF,
  signInAs,
};
