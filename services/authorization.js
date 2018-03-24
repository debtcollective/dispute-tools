const ForbiddenError = require('../lib/errors/ForbiddenError');
const logger = require('../lib/core/logger');

/**
 * Creates an authorization middleware that will allow
 * the request to continue if the passed in test is successful
 *
 * @example
 * Example where we only authorize the route if the requested resource
 * is owned by the user requesting it.
 *
 * <code><pre>
 * authorize(async ({ user, query: { id: fooId }}) => {
 *   const [aFoo] = await Foo.query()
 *     .where('id', fooId)
 *     .limit(1);
 *
 *   return fooId.userId === user.id;
 * })
 * </pre></code>
 *
 * @param {(req: e.Request, res: e.Response) => boolean | Promise<boolean>} test
 *  Should return true if authorized, false otherwise. May optionally
 *  return a Promise resolving in a boolean.
 */
module.exports = test => async (req, res, next) => {
  try {
    let testResult = test(req, res);

    // Handle if the authorization test is a promise
    if (typeof testResult.then === 'function') {
      testResult = await testResult;
    }

    if (testResult) {
      logger.debug(`Authorized ${req.user.email} with ${test.toString()}`);
      next();
    } else {
      logger.debug(`Unable to authorize ${req.user.email} with ${test.toString()}`);
      throw new ForbiddenError();
    }
  } catch (e) {
    next(e);
  }
};
