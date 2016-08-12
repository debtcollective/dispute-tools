/* globals User, Class, ACL */

const expect = require('chai').expect;
const Promise = require('bluebird');
const path = require('path');

const truncate = require(path.join(process.cwd(), 'tests', 'utils', 'truncate'));

describe('RESTfulACL', () => {
  let usersResult;
  let req;

  beforeEach(function beforeEach() {
    this.timeout(10000);

    req = {
      user: {
        id: 0,
      },
      role: 'Admin',
    };

    require(path.join(
        process.cwd(),
        'lib',
        'ACL',
        'restify_acl'
      ))(req);

      // Mock ACL object;
    const getHandler = ACL.getHandler;

    global.ACL = {
      getHandler,
      middlewares: {},
      resources: {
        Users: {
          Visitor: [
            [false],
            ['activation', true],
          ],
          User: [
            ['show', (request) => {
              if (request.params.id === request.user.id) {
                return true;
              }

              return false;
            }],
          ],
          Admin: [true],
        },
      },
    };

    // Create users;
    const users = [
      new User({
        email: 'user1@example.com',
        password: '12345678',
        role: 'User',
      }).save(),
      new User({
        email: 'user2@example.com',
        password: '12345678',
        role: 'User',
      }).save(),
      new User({
        email: 'user3@example.com',
        password: '12345678',
        role: 'Admin',
      }).save(),
    ];

    return Promise.all(users).then((ids) => {
      ids = ids.map((id) => {
        return id[0];
      });

      return User.query().whereIn('id', ids).then((result) => {
        usersResult = result;
      });
    });
  });

  afterEach(() => {
    return truncate(User);
  });

  it('Should load all users if Admin', () => {
    const admin = usersResult.filter((user) => {
      if (user.role === 'Admin') {
        return true;
      }

      return false;
    })[0];

    req.user.id = admin.id;

    return req.restifyACL(usersResult).then((result) => {
      expect(result.length).to.be.equal(usersResult.length);
    });
  });

  it('Should load self if User', () => {
    const user = usersResult.filter((item) => {
      if (item.role === 'User') {
        return true;
      }

      return false;
    })[0];

    req.role = 'User';
    req.user.id = user.id;

    return req.restifyACL(usersResult).then((result) => {
      expect(result.length).to.be.equal(1);
    });
  });

  it('Should load empty if Visitor', () => {
    req.role = 'Visitor';
    // req.user.id = user.id;

    return req.restifyACL(usersResult).then((result) => {
      expect(result.length).to.be.equal(0);
    });
  });
});
