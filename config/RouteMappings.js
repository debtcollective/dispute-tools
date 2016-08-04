var RouteMappings = require('route-mappings');

var routeMappings = RouteMappings()
  .get('/', 'Home#index')
  .get('/no-layout', { to : 'Home#noLayout' })


module.exports = routeMappings;
