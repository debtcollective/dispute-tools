var RouteMappings = require('route-mappings');

var routeMappings = RouteMappings()
  .get('/', 'Home#index')


module.exports = routeMappings;
