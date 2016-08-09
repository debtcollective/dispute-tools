const RouteMappings = require('route-mappings');

const routeMappings = RouteMappings()
  .get('/', { to: 'Home#index', as: 'root' })

  // @TODO: update once Users#new is implemented
  .get('/signup', {
    to: 'Users#new',
    as: 'signup',
  })

  .resources('/Users', (mappings) =>
    mappings()
      .get('/activation', { as: 'activation' })
  );

module.exports = routeMappings;
