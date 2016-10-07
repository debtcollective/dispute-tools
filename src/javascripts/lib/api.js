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
    if (!args || !args.disputeId || !args) {
      throw new Error('Missing required params');
    }

    superagent
      .put(`/disputes/${args.disputeId}/update-dispute-data`)
      .send(args.body || {})
      .set('X-CSRF-Token', csrfToken)
      .end((err, res) => {
        if (typeof callback === 'function') {
          callback(err, res);
        }
      });
  },
};
