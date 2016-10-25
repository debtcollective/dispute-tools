const RouteMappings = require('route-mappings');

const routeMappings = RouteMappings()
  .get('/', {
    to: 'Home#index',
    as: 'root',
  })

  .get('/terms', {
    to: 'Home#tos',
    as: 'tos',
  })

  .get('/about', {
    to: 'Home#about',
    as: 'about',
  })

  .get('/tools-and-services/tool', {
    to: 'Home#tool',
    as: 'tool',
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

  .namespace('/Admin', (mappings) => {
    return mappings()
      .resources('/Disputes')
      .resources('/Collectives');
  })

  .resources('/Users', (mappings) => {
    return mappings()
      .get('/activation', {
        to: 'Users#activation',
        as: 'activation',
      })
      .get('/:token/activate', {
        to: 'Users#activate',
        as: 'activate',
      });
  })

  .resources('/DisputeTools')

  .resources('/Disputes', (mappings) => {
    return mappings()
      .get('/:id/download', {
        to: 'Disputes#download',
        as: 'download',
      })
      .put('/:id/update-dispute-data', {
        to: 'Disputes#updateDisputeData',
        as: 'updateDisputeData',
      })
      .put('/:id/set-signature', {
        to: 'Disputes#setSignature',
        as: 'setSignature',
      })
      .post('/:id/add-attachment', {
        to: 'Disputes#addAttachment',
        as: 'addAttachment',
      })
      .put('/:id/remove-attachment/:attachment_id', {
        to: 'Disputes#removeAttachment',
        as: 'removeAttachment',
      });
  });

module.exports = routeMappings;
