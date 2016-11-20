import superagent from 'superagent';

/**
 * Reference that holds the csrf token for the server to accept our requests.
 * @type {string}
 * @const
 */
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

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

    superagent
      .put(`/disputes/${args.disputeId}/update-dispute-data`)
      .send(args.body || {})
      .set('X-CSRF-Token', csrfToken)
      .set('Accept', 'application/json')
      .end((err, res) => {
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
   * @param {string} args.body.tye - one of ['Text', 'Image', 'Poll']
   * @param {function} [callback] - the callback to handle the server response.
   */
  createCampaignPost(args, callback) {
    if (!args || !args.campaignId) {
      throw new Error('Missing required params');
    }

    superagent
      .post(`/campaigns/${args.campaignId}/posts`)
      .send(args.body || {})
      .set('X-CSRF-Token', csrfToken)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (typeof callback === 'function') {
          callback(err, res);
        }
      });
  },
};
