/* globals Class, Admin */

const {
  authenticate,
  authorize,
  tests: { isDisputeAdmin },
} = require('$services/auth');
const { discourse } = require('$lib');
const BaseController = require('$lib/core/controllers/BaseController');

global.Admin = global.Admin || {};

Admin.UsersController = Class(Admin, 'UsersController').inherits(BaseController)({
  beforeActions: [
    {
      before: [authenticate, authorize(isDisputeAdmin)],
      actions: ['*'],
    },
  ],
  prototype: {
    async index(req, res) {
      const { externalId } = req.query;

      if (!externalId) {
        return res.status(404).send({});
      }

      const user = await discourse.getUserMapping({ externalId });

      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({});
      }
    },
  },
});

module.exports = new Admin.UsersController();
