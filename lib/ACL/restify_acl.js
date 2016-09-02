/* globals CONFIG, ACL */

const Promise = require('bluebird');

module.exports = (req) => {
  const filterRoutes = (resourceName) => {
    const result = [];
    const routes = CONFIG.router.routes.filter((route) => {
      if (route.handler[0] === resourceName) {
        return true;
      }

      return false;
    });

    routes.forEach((route) => {
      if (['put', 'delete'].indexOf(route.verb) || (route.verb === 'get'
        && route.path.search(':id'))) {
        result.push(route);
      }
    });

    return result;
  };

  req.restifyACL = (records) => {
    const result = [];

    if (!records) {
      return [];
    }

    if (!Array.isArray(records)) {
      records = [records];
    }

    const resourceName = records[0].constructor.tableName;

    const routes = filterRoutes(resourceName);

    return Promise.each(records, (record) => {
      return Promise.each(routes, (route) => {
        const handler = ACL.getHandler(route, req.role);

        if (handler && handler.assert) {
          const fixedReq = req;

          fixedReq.params = {
            id: record.id,
          };

          return handler.assert({}, fixedReq)
            .then((handlerResult) => {
              if (handlerResult === true) {
                record._capabilities = record._capabilities || {};

                record._capabilities[route.handler[1]] = {
                  path: route.path.replace(':id', record.id),
                  method: route.verb,
                };
              }
            });
        }

        return false;
      });
    })
    .then(() => {
      records.forEach((record) => {
        if (record._capabilities.show) {
          result.push(record);
        }
      });

      return result;
    });
  };
};
