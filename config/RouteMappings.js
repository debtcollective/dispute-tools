var RouteMappings = require('route-mappings');

var routeMappings = RouteMappings()
  .get('/', 'Home#index')

  // @TODO: update once Users#new is implemented
  .get('/signup', 'Home#usersNew');

module.exports = routeMappings;
