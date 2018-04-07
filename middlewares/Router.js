/* globals logger, CONFIG, neonode */

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

routeMapper.routes.forEach(route => {
  const _handler = route.handler.slice();

  const verbs = [route.verb];
  const action = route._actionName || _handler[_handler.length - 1];
  let controller = route._resourceName || _handler.slice(0, _handler.length - 1).join('.');

  if (_handler.indexOf(controller) > -1) {
    // action
    _handler.pop();

    while (_handler[_handler.length - 1] !== route._resourceName) {
      _handler.pop();
    }

    controller = _handler.join('.');
  }

  verbs.forEach(verb => {
    table.push([route.path, verb.toUpperCase(), controller, action]);

    const controllerObject = neonode.controllers[controller];
    const controllerMethod = controllerObject && controllerObject[action];
    const beforeActions = (controllerObject && controllerObject.constructor.beforeActions) || [];

    if (!controllerObject) {
      throw new Error(`Controller '${controller}' is missing. Handler: ${route.handler.join('.')}`);
    }

    if (!controllerMethod) {
      logger.warn(
        `Action '${action}' for '${controller}' is missing. Handler: ${route.handler.join('.')}`,
      );
      return;
    }

    const args = [];

    /* Get the beforeActions from the controller and filter the ones that
       match the current route.action and flatten the result*/
    if (beforeActions.length > 0) {
      const filters = _.flatten(
        beforeActions
          .filter(item => {
            if (item.actions.includes(action) || item.actions.includes('*')) {
              return true;
            }

            return false;
          })
          .map(item => item.before),
      );

      filters.forEach(filter => {
        if (_.isString(filter)) {
          // if is string look for the method in the same controller
          if (neonode.controllers[controller][filter]) {
            args.push(neonode.controllers[controller][filter]);
          } else {
            throw new Error(`BeforeActions Error: Unknown method ${filter} in ${controller}`);
          }
        } else if (_.isFunction(filter)) {
          // if is a function just add it to the middleware stack
          args.push(filter);
        } else {
          throw new Error(`Invalid BeforeAction ${filter}`);
        }
      });
    }

    args.push(controllerMethod);

    logger.info(
      `Adding route: ${verb} ${route.path} ${route.path === '/admin/users' ? args.join() : ''}`,
    );
    router.route(route.path)[verb](args);
  });
});

logger.info(`Routes: \n${table.toString()}\n`);

logger.info('---------------------------------\n');

logger.info('Route Helpers:');

_helpers.forEach(fn => {
  logger.info(`  ${fn}.url()`);
});

logger.info('\n');

module.exports = router;
