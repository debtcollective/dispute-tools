const RouteMappings = require('route-mappings');

const routeMappings = RouteMappings()
  // Information, content

  .get('/', {
    to: 'Home#index',
    as: 'root',
  })

  .get('/terms', {
    to: 'Home#tos',
    as: 'tos',
  })

  .get('/dispute-tools/defense-to-repayment', {
    to: 'Home#dtr',
    as: 'dtr',
  })

  .get('/about', {
    to: 'Home#about',
    as: 'about',
  })

  .get('/startpage', {
    to: 'Home#startpage',
    as: 'startpage',
  })

  .get('/vision', {
    to: 'Home#vision',
    as: 'vision',
  })

  .get('/contact', {
    to: 'Home#contact',
    as: 'contact',
  })

  .post('/contact', {
    to: 'Home#sendContact',
  })

  .get('/tools-and-services/tool', {
    to: 'Home#tool',
    as: 'tool',
  })

  .post('/login', {
    to: 'Home#login',
    as: 'login',
  })

  .get('/logout', {
    to: 'Home#logout',
    as: 'logout',
  })

  // Admin
  .namespace('/Admin', mapAdmins =>
    mapAdmins()
      .resources('/Disputes', mapAdminDisputes =>
        mapAdminDisputes()
          .get('/:id/admins', {
            to: 'Disputes#getAvailableAdmins',
            as: 'getAvailableAdmins',
          })
          .post('/:id/admins', {
            to: 'Disputes#updateAdmins',
            as: 'updateAdmins',
          }),
      )
      .resources('/Users'),
  )

  // Dispute Tools

  .resources('/DisputeTools')

  // Disputes

  .resources('/Disputes', mapDisputes =>
    mapDisputes()
      .get('/:id/download', {
        to: 'Disputes#download',
        as: 'download',
      })
      .put('/:id/update-submission', {
        to: 'Disputes#updateSubmission',
        as: 'updateSubmission',
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
      }),
  )

  .post('/donate', {
    to: 'Home#donate',
    as: 'donate',
  });

module.exports = routeMappings;
