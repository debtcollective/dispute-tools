/* global fetch, FormData, airbrake */

/**
 * Reference that holds the csrf token for the server to accept our requests.
 * @type {string}
 * @const
 */
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

// quick helper
export function req(opts, cb) {
  opts.headers = opts.headers || {};

  // Capture errors with airbrake
  cb = airbrake.wrap(cb);

  opts.credentials = 'same-origin';
  opts.headers.Accept = 'application/json';
  opts.headers['X-CSRF-Token'] = csrfToken;

  if (!(opts.body instanceof FormData)) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(opts.body);
  }

  if (opts.method === 'get') {
    delete opts.method;
    delete opts.body;
  }

  fetch(opts.url, opts)
  .then((res) =>
    res.json()
      .then((result) => {
        cb(null, {
          body: result,
          headers: res.headers,
        });
      }))
  .catch((error) => cb && cb(error));
}

/**
 * Collection of 'application/json' endpoints we are allowed to use to
 * communicate with the server.
 */
export default {
  /**
   * Updates a dispute data.
   * @param {Object} args - the arguments needed to hit an endpoint.
   * @param {string} args.disputeId - dispute’s id to update its data.
   * @param {Object} [args.body={}] - the request body.
   * @param {string} args.body.command - one of
   *  ['setForm', 'setDisputeProcess', 'setConfirmFollowUp']
   * @param {function} [callback] - the callback that handles the response.
   */
  updateDisputeData(args, callback) {
    if (!args || !args.disputeId) {
      throw new Error('Missing required params');
    }

    req({
      url: `/disputes/${args.disputeId}/update-dispute-data`,
      method: 'put',
      body: args.body || {},
    }, (err, res) => {
      if (typeof callback === 'function') {
        callback(err, res);
      }
    });
  },

  /**
   * Creates a new Post related to a Campaign.
   * @param {Object} args - the arguments needed to hit the endpoint.
   * @param {string} args.campaignId - the campaign id to which the post will be related.
   * @param {Object} [args.body={}] - the request body to be send to the server.
   * @property {string} args.body.type - one of ['Text', 'Image', 'Poll']
   * @param {function} [callback] - the callback to handle the server response.
   */
  createCampaignPost(args, callback) {
    if (!args || !args.campaignId) {
      throw new Error('Missing required params');
    }

    req({
      url: `/campaigns/${args.campaignId}/posts`,
      method: 'post',
      body: args.body,
    }, (err, res) => {
      if (typeof callback === 'function') {
        callback(err, res);
      }
    });
  },

  /**
   * Returns a page of n* number of posts for a specific campaign.
   * The number of posts is defined by PostsController PAGE_SIZE constant.
   * @param {Object} args - the arguments needed to hit the endpoint.
   * @param {string} args.campaignId - the campaign id to which the post will be related.
   * @param {number} [args.page=1] - the page to request
   * @return {Object} response object
   * @property {Array<Object>} body - the posts data
   * @property {string} headers.total_count - campaign’s total number of posts
   * @property {string} headers.total_pages - the total number of pages
   * @param {function} [callback] - the callback to handle the server response.
   */
  getCampaignPosts(args, callback) {
    if (!args || !args.campaignId) {
      throw new Error('Missing required params');
    }

    req({
      url: `/campaigns/${args.campaignId}/posts?page=${args.page || 1}`,
      method: 'get',
    }, (err, res) => {
      if (typeof callback === 'function') {
        callback(err, res);
      }
    });
  },

  /**
   * Registers a new vote for a Post of type Poll.
   * @param {Object} args - the arguments needed to hit the endpoint.
   * @param {string} args.campaignId - the campaign id to which the post is associated with.
   * @param {string} args.postId - the post id to cast the vote.
   * @param {function} [callback] - the callback to handle the server response.
   */
  campaignPostVote(args, callback) {
    if (!args || !args.campaignId || !args.postId) {
      throw new Error('Missing required params');
    }

    req({
      url: `/campaigns/${args.campaignId}/posts/${args.postId}/vote`,
      method: 'post',
      body: args.body || {},
    }, (err, res) => {
      if (typeof callback === 'function') {
        callback(err, res);
      }
    });
  },

  /**
   * Creates a new comment for a specific post.
   * @param {Object} args - the arguments needed to hit the endpoint.
   * @param {string} args.campaignId - the campaign id to which the post is associated with.
   * @param {string} args.postId - the post id to cast the vote.
   * @param {function} [callback] - the callback to handle the server response.
   */
  postCreateComment(args, callback) {
    if (!args || !args.campaignId || !args.postId) {
      throw new Error('Missing required params');
    }

    req({
      url: `/campaigns/${args.campaignId}/posts/${args.postId}`,
      method: 'post',
      body: args.body || {},
    }, (err, res) => {
      if (typeof callback === 'function') {
        callback(err, res);
      }
    });
  },

  /**
  * Charges a creditcard using a token generated by Stripe.
  */
  postStripePayment(args, callback) {
    req({
      url: '/donate',
      method: 'post',
      body: args.body || {},
    }, (err, res) => {
      if (typeof callback === 'function') {
        callback(err, res);
      }
    });
  },
};
