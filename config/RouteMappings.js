const RouteMappings = require('route-mappings');

const routeMappings = RouteMappings()
  // Information, content

  .get('/', {
    to: 'Home#index',
    as: 'root',
  })

  .get('/dashboard', {
    to: 'Dashboard#index',
    as: 'dashboard',
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

  // Users and Sessions

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
          })
      )
      .resources('/Collectives', mapAdminCollectives =>
        mapAdminCollectives()
          .resources('/Users')
          .resources('/Campaigns', mapAdminCampaigns =>
            mapAdminCampaigns()
              .resources('/KBPosts')
              .resources('/Events')
              .post('/:id/activate', {
                to: 'Campaigns#activate',
                as: 'activate',
              })
              .post('/:id/deactivate', {
                to: 'Campaigns#deactivate',
                as: 'deactivate',
              })
              .post('/files', {
                to: 'Campaigns#uploadFiles',
                as: 'uploadFiles',
              })
          )
      )
      .resources('/Users', mapAdminUsers =>
        mapAdminUsers()
          .post('/:id/ban', {
            to: 'Users#ban',
            as: 'ban',
          })
          .delete('/:id/ban', {
            to: 'Users#unban',
            as: 'unban',
          })
      )
  )

  // Users

  .resources('/Users', mapUsers =>
    mapUsers()
      .get('/activation', {
        to: 'Users#activation',
        as: 'activation',
      })
      .get('/:token/activate', {
        to: 'Users#activate',
        as: 'activate',
      })
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
      })
  )

  // Collectives

  .resources('/Collectives', mapCollectives =>
    mapCollectives().post('/:id/join', {
      to: 'Collectives#join',
      as: 'join',
    })
  )

  // Campaigns

  .resources('/Campaigns', mapCampaigns =>
    mapCampaigns()
      .resources('/Events', mapCampaignEvents =>
        mapCampaignEvents()
          .post('/:id/rsvp', { as: 'doRSVP' })
          .delete('/:id/rsvp', { as: 'undoRSVP' })
      )
      .post('/:id/join', {
        to: 'Campaigns#join',
        as: 'join',
      })
  )

  // Posts

  .get('/campaigns/:id/posts', {
    to: 'Posts#index',
    as: 'PostsIndex',
  })
  .post('/campaigns/:id/posts/:post_id', {
    to: 'Posts#createComment',
    as: 'CreatePostComment',
  })
  .post('/campaigns/:campaign_id/posts/:id/vote', {
    to: 'Posts#votePoll',
    as: 'VotePostPoll',
  })
  .post('/campaigns/:id/posts', {
    to: 'Posts#create',
    as: 'CreatePost',
  })
  .put('/campaigns/:campaign_id/posts/:id', {
    to: 'Posts#update',
    as: 'UpdatePost',
  })
  .delete('/campaigns/:campaign_id/posts/:id', {
    to: 'Posts#delete',
    as: 'DeletePost',
  })

  .post('/donate', {
    to: 'Home#donate',
    as: 'donate',
  });

module.exports = routeMappings;
