const RouteMappings = require('route-mappings');

const routeMappings = RouteMappings()
  .get('/', {
    to: 'Home#index',
    as: 'root',
  })

  .get('/defense-to-repayment', {
    to: 'DisputeTools#dtr',
    as: 'dtr',
  })

  .get('/dispute-tools/defense-to-repayment', {
    to: 'Home#dtr',
    as: 'dtrRedirect',
  })

  .get('/about', {
    to: 'Home#about',
    as: 'about',
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

  .get('/login', {
    to: 'Sessions#create',
    as: 'login',
  })

  .get('/auth/discourse/callback', {
    to: 'Sessions#callback',
    as: 'callback',
  })

  .get('/logout', {
    to: 'Sessions#destroy',
    as: 'logout',
  })

  .get('/health-check', {
    to: 'Home#healthCheck',
    as: 'healthCheck',
  })

  // Admin
  .namespace('/Admin', mapAdmins =>
    mapAdmins().resources('/Disputes', mapAdminDisputes =>
      mapAdminDisputes()
        .get('/:id/admins', {
          to: 'Disputes#getAvailableAdmins',
          as: 'getAvailableAdmins',
        })
        .post('/:id/admins', {
          to: 'Disputes#updateAdmins',
          as: 'updateAdmins',
        })
        .put('/:id/data', {
          to: 'Disputes#updateDisputeData',
          as: 'updateDisputeData',
        })
        .get('/:id/attachment/:aid', {
          to: 'Disputes#downloadAttachment',
          as: 'downloadAttachment',
        })
        .delete('/:id/attachment/:aid', {
          to: 'Disputes#deleteAttachment',
          as: 'deleteAttachment',
        }),
    ),
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
      .post('/:id/attachment', {
        to: 'Disputes#addAttachment',
        as: 'addAttachment',
      })
      .put('/:id/remove-attachment/:attachment_id', {
        to: 'Disputes#removeAttachment',
        as: 'removeAttachment',
      })
      .get('/my', {
        to: 'Disputes#myDisputes',
        as: 'myDisputes',
      }),
  )

  .post('/donate', {
    to: 'Home#donate',
    as: 'donate',
  });

module.exports = routeMappings;
