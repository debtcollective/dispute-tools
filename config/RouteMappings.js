const RouteMappings = require('route-mappings');

const routeMappings = RouteMappings()
  .get('/', { to: 'Home#index', as: 'root' })

  .get('/signup', {
    to: 'Users#new',
    as: 'signup',
  })

  .resources('/Users', (mappings) =>
    mappings()
      .get('/activation', { as: 'activation' })
  );

module.exports = routeMappings;
