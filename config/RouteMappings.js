const RouteMappings = require('route-mappings');

const routeMappings = RouteMappings()
  /*
   * Base links
   */
  .get('/about', {
    to: 'Home#about',
    as: 'about',
  })

  .get('/contact', {
    to: 'Home#contact',
    as: 'contact',
  })

  .post('/contact', {
    to: 'Home#sendContact',
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

  .get('/donate', {
    to: 'Home#donate',
    as: 'donate',
  })

  /*
   * Admin
   */
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

  /*
   * Disputes
   */
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

  /*
   * Dispute Tools
   */

  // Redirects to keep old links working
  .get('/dispute-tools/defense-to-repayment', {
    to: 'Home#dtr',
    as: 'dtrRedirect',
  })

  .get('/dispute-tools', {
    to: 'Home#tools',
    as: 'toolsRedirect',
  })

  .get('/dispute-tools/:id', {
    to: 'Home#tool',
    as: 'toolRedirect',
  })

  .get('/defense-to-repayment', {
    to: 'DisputeTools#dtr',
    as: 'dtr',
  })

  .get('/', {
    to: 'DisputeTools#index',
    as: 'root',
  })

  .get('/:id/start', {
    to: 'DisputeTools#startDispute',
    as: 'startDispute',
  })

  .get('/:id', {
    to: 'DisputeTools#show',
    as: 'tool',
  });

module.exports = routeMappings;
