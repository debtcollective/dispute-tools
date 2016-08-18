/* globals Sc */

// this value may be taken through the route-mappings API
const ACL_ALL_REST = ['new', 'show', 'edit', 'index', 'create', 'update', 'destroy'];

// helper for promisifying all values
const toPromiseValue = (test) => {
  return (req) => {
    if (Array.isArray(test)) {
      // perform checking from all tests
      const fixedTests = test.map((check) => {
        // TODO: consider Promise.each() for sequence checks
        return check(req);
      });

      return Promise.all(fixedTests).then((results) => {
        // returns false if any value is false
        return !results.filter((value) => {
          return !value;
        }).length;
      });
    }

    // single callback value or boolean
    return Promise.resolve(typeof test === 'function' ? test(req) : test);
  };
};

// helper for handler normalization
const fixHandler = (value) => {
  if (Array.isArray(value)) {
    if (value[0] === true || value[0] === false) {
      return ACL_ALL_REST.concat(toPromiseValue(value[0]));
    }

    value[value.length - 1] = toPromiseValue(value[value.length - 1]);

    return value;
  }

  return value;
};

// base helper to translate top-level to low-level
const setRules = (...args) => {
  const ruleset = {};

  args.forEach((rule) => {
    const fixedRule = fixHandler(rule);

    if (Array.isArray(fixedRule)) {
      const cb = fixedRule.pop();

      fixedRule.forEach((key) => {
        ruleset[key] = cb;
      });
    } else {
      Object.keys(rule).forEach((key) => {
        ruleset[key] = toPromiseValue(rule[key]);
      });
    }
  });

  return ruleset;
};

// normalize all given resources
const buildResources = (resources) => {
  const fixedResources = {};

  Object.keys(resources).forEach((resourceName) => {
    const res = resources[resourceName];
    const fixedRes = fixedResources[resourceName] = {};

    Object.keys(res).forEach((role) => {
      // reference for compiled ACL
      if (!fixedRes[role]) {
        fixedRes[role] = {
          actions: [],
        };
      }

      // process rule definitions
      if (Array.isArray(res[role])) {
        // convert single to multiple rulesets
        if (!Array.isArray(res[role][0])) {
          res[role] = [res[role]];
        }

        // process each ruleset
        res[role].forEach((rules) => {
          const fixedRules = setRules(rules);
          // console.log('setRules', fixedRules)

          // apply compiled ACL for each resource-action
          Object.keys(fixedRules).forEach((action) => {
            fixedRes[role][action] = fixedRules[action];
            fixedRes[role].actions.push(action);
          });
        });
      } else {
        // process and normalize given object
        Object.keys(res[role]).forEach((action) => {
          fixedRes[role][action] = toPromiseValue(res[role][action]);
          fixedRes[role].actions.push(action);
        });
      }
    });
  });

  return fixedResources;
};

// compile all required middlewares per-resource
function buildMiddlewares(resources) {
  const fixedMiddleware = {};

  // we can register all resources through its keys
  Object.keys(resources).forEach((resourceName) => {
    // regitry for the given resource
    Sc.ACL.addResource(new Sc.Resource(resourceName));

    // iterate through and append each role
    Object.keys(resources[resourceName]).forEach((roleName) => {
      const fixedRole = resources[resourceName][roleName];

      // now, append the registered callbacks
      fixedRole.actions.forEach((actionName) => {
        // pass the compiled callback as-is
        Sc.ACL.setRule(actionName, resourceName, roleName, fixedRole[actionName], 'TYPE_ALLOW');
      });

      // finally, we can create our middleware per-resource and actions
      fixedMiddleware[resourceName] = fixedMiddleware[resourceName] || {};

      fixedRole.actions.forEach((actionName) => {
        fixedMiddleware[resourceName][actionName] = Sc.ACL.can(actionName, resourceName);
      });
    });
  });

  return fixedMiddleware;
}

module.exports = {
  buildResources,
  buildMiddlewares,
};
