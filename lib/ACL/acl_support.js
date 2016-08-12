/* globals Sc, ACL */

const path = require('path');
const glob = require('glob');

const util = require('./acl_helpers');

// main ACL setup
const roles = require(path.join(process.cwd(), 'ACL', 'index.js'));

// expand arrays to Sc => GrandParent.Parent.Child
if (Array.isArray(roles)) {
  const seen = {};

  roles.forEach((role) => {
    let lastRole;

    role.split('.').forEach((subRole) => {
      if (!seen[subRole]) {
        Sc.ACL.addRole(new Sc.Role(subRole), lastRole || []);
        seen[subRole] = 1;
      }

      lastRole = [subRole];
    });
  });
}

const resources = {};

// load resources
glob.sync('ACL/*/index.js').forEach((file) => {
  resources[path.basename(path.dirname(file))] = require(path.join(process.cwd(), file));
});

const fixedResources = util.buildResources(resources);

// TODO: no more globals?
global.ACL = {
  resources: fixedResources,
  middlewares: util.buildMiddlewares(fixedResources),
  getHandler(route, role) {
    return Sc.ACL.getRule(route.handler[1], route.handler[0], [role]);
  },
};
