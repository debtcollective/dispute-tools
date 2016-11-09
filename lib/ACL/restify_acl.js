/* globals CONFIG, ACL */

const Promise = require('bluebird');

module.exports = (req) => {
  const filterRoutes = (resourceName) => {
    resourceName = resourceName.split('.');
    const result = [];
    const routes = CONFIG.router.routes.filter((route) => {
      switch (route.handler.length) {
        case 2:
          if (route.handler[0] === resourceName[0]) {
            return true;
          }

          return false;
        case 3:
          if (route.handler[0] === resourceName[0] && route.handler[1] === resourceName[1]) {
            return true;
          }

          return false;
      }
    });

    routes.forEach((route) => {
      let isPutOrDelete = false;
      let isGetWithID = false;

      if (['put', 'delete'].indexOf(route.verb) !== -1) {
        isPutOrDelete = true;
      }

      if (route.verb === 'get' && route.path.search(':id') !== -1) {
        isGetWithID = true;
      }

      if (isPutOrDelete || isGetWithID) {
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

    const resourceName = records[0].constructor.resourceName || records[0].constructor.tableName;

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
              record._capabilities = record._capabilities || {};

              if (handlerResult === true) {
                record._capabilities[route._actionName] = {
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
