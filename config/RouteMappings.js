const RouteMappings = require('route-mappings');

const routeMappings = RouteMappings()
  .get('/', {
    to: 'Home#index',
    as: 'root',
  })

  .get('/signup', {
    to: 'Users#new',
    as: 'signup',
  })

  .get('/acl', {
    to: 'ACL#index',
    as: 'acl',
  })

  .resources('/Users', (mappings) => {
    return mappings()
      .get('/activation', {
        as: 'activation',
        to: 'Users#activation',
      });
  });

module.exports = routeMappings;
