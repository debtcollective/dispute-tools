/* global Class, Admin, Collective, RestfulController */

global.Admin = global.Admin || {};
global.Admin.Collectives = global.Admin.Collectives
  || Class(Admin, 'Collective').inherits(Collective)({
    resourceName: 'Admin.Collectives',
  });

const KBPostsController = Class(Admin.Collectives, 'KBPostsController').inherits(RestfulController)({
});

module.exports = new KBPostsController();
