/* globals Class, RestfulController, CONFIG, ACL */

const Promise = require('bluebird');

const filterRoutes = () => {
  const result = [];

  CONFIG.router.routes.forEach((route) => {
    const action = route._actionName || route.handler[1];

    if (['index', 'new', 'create'].indexOf(action) !== -1 || (route.verb === 'get'
      && route.path.search(':id') === -1)) {
      result.push(route);
    }
  });

  return result;
};

const ACLController = Class('ACLController').inherits(RestfulController)({

  prototype: {
    index(req, res, next) {
      const response = {};

      const routes = filterRoutes();

      Promise.each(routes, (route) => {
        const handler = ACL.getHandler(route, req.role);

        if (handler && handler.assert) {
          return handler.assert(req)
            .then((handlerResult) => {
              if (handlerResult === true) {
                const resource = route.handler[0] || route._resourceName;
                const action = route._actionName || route.handler[1];

                response[resource] = response[resource] || {};

                response[resource][action] = {
                  path: route.path,
                  method: route.verb,
                };
              }
            });
        }

        return false;
      })
      .then(() => {
        res.json(response);
      })
      .catch(function(err) {
        console.log('ERROR:', err)
      });
    },
  },
});

module.exports = new ACLController();
