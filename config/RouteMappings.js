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

  .get('/login', {
    to: 'Sessions#new',
    as: 'login',
  })

  .post('/login', {
    to: 'Sessions#create',
  })

  .delete('/logout', {
    to: 'Sessions#destroy',
    as: 'logout',
  })

  .get('/reset-password', {
    to: 'Sessions#showEmailForm',
    as: 'resetPassword',
  })

  .post('/reset-password', {
    to: 'Sessions#sendResetEmail',
  })

  .get('/reset-password/:token', {
    to: 'Sessions#showPasswordForm',
    as: 'resetPasswordWithToken',
  })

  .put('/reset-password/:token', {
    to: 'Sessions#resetPassword',
  })

  .get('/acl', {
    to: 'ACL#index',
    as: 'acl',
  })

  .resources('/Users', (mappings) => {
    return mappings()
      .get('/activation', {
        to: 'Users#activation',
        as: 'activation',
      });
  });

module.exports = routeMappings;
