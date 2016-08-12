/* globals logger, CONFIG, neonode, ACL */

const _ = require('lodash');
const Table = require('cli-table');
_.mixin(require('lodash-inflection'));

const routeMapper = CONFIG.router;

const router = global.neonode.express.Router();

logger.info('Loading routes...');

const _helpers = [];

const table = new Table({
  head: ['Path', 'Method', 'Controller', 'Action'],
  // colWidths: [40, 7, ],
});

routeMapper.routes.forEach((route) => {
  const _handler = route.handler.slice();

  // save named callback
  _helpers.push(route.as);

  const verbs = [route.verb];
  const action = route._actionName || _handler.pop();
  const controller = route._resourceName || _handler.pop();

  verbs.forEach((verb) => {
    table.push(
      [
        route.path,
        verb.toUpperCase(),
        controller,
        action,
      ]
    );

    const controllerObject = neonode.controllers[controller];
    const controllerMethod = controllerObject && controllerObject[action];
    const beforeActions = (controllerObject
      && controllerObject.constructor.beforeActions) || [];

    if (!controllerObject) {
      throw new Error(`Controller '${controller}' is missing`);
    }

    if (!controllerMethod) {
      throw new Error(`Action '${action}' for '${controller}' is missing `);
    }

    const args = [];

    /* Get the beforeActions from the controller and filter the ones that
       match the current route.action and flatten the result*/
    if (beforeActions.length > 0) {
      const filters = _.flatten(beforeActions.filter((item) => {
        if (item.actions.indexOf(action) !== -1) {
          return true;
        }

        return false;
      }).map((item) => {
        return item.before;
      }));

      filters.forEach((filter) => {
        if (_.isString(filter)) { // if is string look for the method in the same controller
          if (neonode.controllers[controller][filter]) {
            args.push(neonode.controllers[controller][filter]);
          } else {
            throw new Error(`BeforeActions Error: Unknown method ${filter} in ${controller}`);
          }
        } else if (_.isFunction(filter)) { // if is a function just add it to the middleware stack
          args.push(filter);
        } else {
          throw new Error(`Invalid BeforeAction ${filter}`);
        }
      });
    }

    // append built middleware for this resource
    if (ACL && ACL.middlewares[controller]
      && ACL.middlewares[controller][action]) {
      args.push(ACL.middlewares[controller][action]);
    }

    args.push(controllerMethod);

    router.route(route.path)[verb](args);
  });
});

logger.info(`Routes: \n${table.toString()}\n`);

logger.info('---------------------------------\n');

logger.info('Route Helpers:');

_helpers.forEach((fn) => {
  logger.info(`  ${fn}.url()`);
});

logger.info('\n');

module.exports = router;
