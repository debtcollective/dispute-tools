const path = require('path');

module.exports = (req, res, next) => {
  require(path.join(process.cwd(), 'lib', 'ACL', 'restify_acl'))(req);
  next();
};
