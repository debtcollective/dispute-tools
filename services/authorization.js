/**
 * Creates an authorization test
 * @param {(user: User, req: Request) => boolean} test
 *  Should return true if authorized, false otherwise
 */
module.exports = test => (req, res, next) => {
  if (test(req, res)) {
    next();
  } else {
    throw new Error('Authorization failed!');
  }
};
