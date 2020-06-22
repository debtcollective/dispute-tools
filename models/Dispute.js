/* globals Class, Krypton */
/* eslint arrow-body-style: 0 */

const Promise = require('bluebird');
const _ = require('lodash');
const { basePath } = require('$lib/AWS');
const DisputeAttachment = require('$models/DisputeAttachment');
const DisputeTool = require('$models/DisputeTool');
const DisputeStatus = require('$models/DisputeStatus');
const DisputeRenderer = require('$models/DisputeRenderer');
const User = require('$models/User');
const { logger, discourse, Sentry } = require('$lib');
const { getCheckitConfig, filterDependentFields } = require('$services/formValidation');
const Checkit = require('$shared/Checkit');
const { DisputeThreadOriginMessage } = require('$services/messages');
const discourseApi = require('$lib/discourse');
const {
  discourse: { baseUrl: discourseEndpoint },
} = require('$config/config');

const Dispute = Class('Dispute')
  .inherits(Krypton.Model)
  .includes(Krypton.Attachment)({
  tableName: 'Disputes',
  validations: {
    userId: ['required'],
    disputeToolId: ['required'],
  },
  attributes: [
    'id',
    'readableId',
    'userId',
    'disputeToolId',
    'data',
    'deactivated',
    'createdAt',
    'updatedAt',
    'disputeThreadId',
  ],

  processors: [
    disputes =>
      disputes.map(d => ({
        ...d,
        disputeThreadLink: `${discourseEndpoint}/t/${d.disputeThreadId}`,
      })),
  ],

  defaultIncludes: '[user, statuses]',

  /**
   * `includes` doesn't work correctly when you need to write raw queries
   * I'm using Knex joins to handle this instead
   */
  _defaultKnexJoins(query) {
    const knex = this.knex();

    return query
      .join('Users', 'Disputes.user_id', 'Users.id')
      .join('DisputeStatuses', function on() {
        this.on('Disputes.id', '=', 'DisputeStatuses.dispute_id').andOn(
          'DisputeStatuses.created_at',
          '=',
          knex.raw(
            '(select max("DisputeStatuses".created_at) from "DisputeStatuses" where "DisputeStatuses".dispute_id = "Disputes".id)',
          ),
        );
      });
  },

  /**
   * Returns Disputes filtered with the provided querystring
   * @return {Array<Disputes, Object>} [results, pagination]
   * */
  async search(options) {
    // back-end search
    const countQuery = this._defaultKnexJoins(this.query());
    const query = this._defaultKnexJoins(this.query());

    // count distint
    countQuery.countDistinct('Disputes.id');

    // select fields we want to retrieve
    query.select([
      'Disputes.*',
      'Users.name',
      'Users.username',
      'Users.email',
      'DisputeStatuses.status',
      'DisputeStatuses.pending_submission',
    ]);

    // pagination
    const perPage = process.env.DISPUTES_PER_PAGE || options.perPage || 30;
    const page = options.page || 1;
    let totalCount = 0;

    if (options.filters) {
      // If we're passed a human readable id just search by that and ignore everything else
      // check we are receiving a number before doing the query
      if (options.filters.readable_id && !isNaN(options.filters.readable_id)) {
        const results = await query.where('readable_id', options.filters.readable_id);
        const totalPages = 1;

        return [results, { totalPages, currentPage: page }];
      }

      if (options.filters.admin_id) {
        const disputeIds = await Dispute.knex()('AdminsDisputes')
          .select('dispute_id')
          .where('admin_id', options.filters.admin_id);

        query.whereIn('id', disputeIds.map(d => d.dispute_id));
        countQuery.whereIn('id', disputeIds.map(d => d.dispute_id));
      }

      if (options.filters.dispute_tool_id) {
        query.andWhere('dispute_tool_id', options.filters.dispute_tool_id);
        countQuery.andWhere('dispute_tool_id', options.filters.dispute_tool_id);
      }
    }

    // Filter by status
    if (options.status) {
      // grab query and filter by status using a join against the latest status record
      // for each dispute
      query.andWhere('DisputeStatuses.status', options.status);
      countQuery.andWhere('DisputeStatuses.status', options.status);
    }

    // Filter by user name
    if (options.name) {
      const ilike = `%${options.name}%`;

      query.andWhere(function andWhere() {
        this.where('Users.name', 'ILIKE', ilike);
        this.orWhere('Users.email', 'ILIKE', ilike);
        this.orWhereRaw("data->'forms'->>'personal-information-form' ILIKE ?", [ilike]);
        this.orWhereRaw("data->'_forms'->>'personal-information-form' ILIKE ?", [ilike]);
      });

      countQuery.andWhere(function andWhere() {
        this.where('Users.name', 'ILIKE', ilike);
        this.orWhere('Users.email', 'ILIKE', ilike);
        this.orWhereRaw("data->'forms'->>'personal-information-form' ILIKE ?", [ilike]);
        this.orWhereRaw("data->'_forms'->>'personal-information-form' ILIKE ?", [ilike]);
      });
    }

    // order records
    const orderBy = options.order || '-created_at';
    let order = 'DESC';

    // Front-end send either 'created_at` or '-created_at'
    // Where '-created_at' means DESC
    if (orderBy && ['created_at', '-created_at'].includes(orderBy)) {
      if (orderBy.indexOf('-') !== 0) {
        order = 'ASC';
      }

      query.orderBy('Disputes.created_at', order);
    }

    // Get the count of records with filters
    // I couldn't find a better way to do this, since we can't reuse the same
    // Krypton query to just find the count.
    //
    // Even when we are doing this, it's much better to what we had before since we are not
    // doing N+1 queries and just 2.
    //
    // TODO: Find a cleaner way to do this
    try {
      [{ count: totalCount }] = await countQuery;
    } catch (e) {
      console.log(e);
      throw e;
    }
    const totalPages = Math.ceil(~~totalCount / perPage);

    // paginate query using limit and offset
    query.limit(perPage).offset((page - 1) * perPage);

    // get results
    let results = [];
    try {
      results = await query;
    } catch (e) {
      console.log(e);
      throw e;
    }

    // Return the results along pagination stats
    return [results, { totalPages, currentPage: page }];
  },

  async findById(id, include = Dispute.defaultIncludes) {
    const INCLUDE_DEACTIVATED = true;
    const query = Dispute.query(null, INCLUDE_DEACTIVATED).where({ id });
    if (typeof include === 'string') {
      query.include(include);
    }
    const [dispute] = await query.limit(1);
    return dispute;
  },

  findByUser(user, include = Dispute.defaultIncludes) {
    const query = Dispute.query().where('user_id', user.id);
    if (typeof include === 'string') {
      query.include(include);
    }
    return query;
  },

  async createFromTool({ user, disputeToolId, option }) {
    const dispute = new Dispute({
      disputeToolId,
      userId: user.id,
      statuses: [],
    });

    const status = new DisputeStatus({
      status: 'New',
    });

    dispute.setOption(option);

    await Dispute.transaction(async trx => {
      dispute.transacting(trx);
      status.transacting(trx);

      const [disputeId] = await dispute.save();

      status.disputeId = disputeId;

      await status.save();
    });

    dispute.statuses.push(status);

    return dispute;
  },

  async createDiscourseThread(dispute) {
    if (dispute.disputeThreadId || !dispute.id) {
      return false;
    }

    const disputeTool = await DisputeTool.findById(dispute.disputeToolId);
    const user = dispute.user;

    try {
      const {
        post: { topic_id: topicId },
      } = await new DisputeThreadOriginMessage(user, dispute, disputeTool).send();

      dispute.disputeThreadId = topicId;
      await dispute.save();
    } catch (e) {
      Sentry.captureException(e);
      logger.error(
        'Failure creating the %s for dispute with id %s and tool %s',
        DisputeThreadOriginMessage.name,
        dispute.readableId,
        disputeTool.name,
      );
    }
  },

  async closeDiscourseThread(dispute) {
    if (!dispute.id || !dispute.disputeThreadId) {
      return false;
    }

    try {
      await discourseApi.topics.updateStatus(dispute.disputeThreadId, 'closed');
      logger.info(`Dispute Thread ${dispute.disputeThreadId} closed`);
    } catch (e) {
      Sentry.captureException(e);
      logger.error('Error closing Discourse PM. Dispute id %s', dispute.readableId);
    }
  },

  prototype: {
    data: null,
    deactivated: false,

    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.data = this.data || {};

      return this;
    },

    // Krypton's default _getAttributes will replace any undefined
    // attributes with null, causing our default valued columns
    // to get null inserted into them (thereby telling Postgres to
    // not use the default...) We can override that to prevent it for
    // any given property (in this case, readableId)

    // @Override
    _getAttributes() {
      const model = this;

      const values = _.clone(model);

      const sanitizedData = {};

      model.constructor.attributes.forEach(attribute => {
        // We skip readableId so that Krypton doesn't try to insert null into the database
        if (_.isUndefined(values[attribute]) && attribute !== 'readableId') {
          sanitizedData[attribute] = null;
        } else {
          sanitizedData[attribute] = values[attribute];
        }
      });

      return sanitizedData;
    },

    setOption(option) {
      this.data.option = option;

      return this;
    },

    /**
     * Set the signature on the dispute data
     *
     * TODO Why does this method save the dispute and the above does not?
     * @param {string} signature
     */
    setSignature(signature) {
      const dispute = this;

      return new Promise((resolve, reject) => {
        if (!signature) {
          throw new Error('The signature is required');
        }

        dispute.data.signature = signature;

        dispute
          .save()
          .then(resolve)
          .catch(reject);
      });
    },

    /**
     * Moves the dispute into the incompleted status.
     * This method can only be called if the Dispute has New as status
     *
     * @param {boolean} saved returns true if the status was changed correctly, false otherwise
     */
    async markAsIncompleted() {
      const dispute = this;

      if (!dispute.isNew()) {
        return false;
      }

      // create incomplete status and persist
      const incompleteStatus = new DisputeStatus({
        status: 'Incomplete',
        disputeId: dispute.id,
      });

      await incompleteStatus.save();

      dispute.statuses.push(incompleteStatus);

      // create discourse thread
      await Dispute.createDiscourseThread(dispute);

      return true;
    },

    /**
     * returns true if the dispute status is equal to 'New'
     *
     * @param {boolean} isNew true if dispute status is equal to 'New'
     */
    isNew() {
      const dispute = this;
      const status = _.first(dispute.statuses);

      return status && status.status === 'New';
    },

    /**
     * Check if a dispute is empty or not
     *
     * @returns {bool} true if the dispute doesn't have any data
     */
    isEmpty() {
      const { data } = this;

      if (_.has(data, 'forms')) {
        return false;
      }

      if (_.has(data, '_forms')) {
        let isEmpty = true;

        // check that at least one field is not empty
        const forms = Object.keys(data._forms);

        _.forEach(forms, formKey => {
          const formData = data._forms[formKey];

          _.forEach(formData, value => {
            if (!_.isEmpty(value)) {
              isEmpty = false;

              return false;
            }
          });

          if (!isEmpty) {
            return false;
          }
        });

        return isEmpty;
      }

      return true;
    },

    /**
     * Moves the dispute into the completed status
     *
     * TODO This method does too much, refactor to be multiple method calls and use async/await
     * @param {boolean} pendingSubmission
     */
    async markAsCompleted(pendingSubmission) {
      const dispute = this;
      this.data.disputeConfirmFollowUp = true;

      await dispute.save();

      return new Promise((resolve, reject) => {
        const disputeStatus = new DisputeStatus({
          status: 'Completed',
          disputeId: dispute.id,
          pendingSubmission,
        });

        return DisputeTool.query()
          .where({ id: dispute.disputeToolId })
          .then(([tool]) => {
            return DisputeTool.transaction(trx => {
              return dispute
                .transacting(trx)
                .save()
                .then(() => {
                  tool.completed++;
                  return tool.transacting(trx).save();
                })
                .then(() => {
                  return disputeStatus.transacting(trx).save();
                });
            });
          })
          .then(resolve)
          .catch(err => {
            Sentry.captureException(err);
            logger.error('Error while giving [dispute=%s] a completed status', dispute.id, err);
            reject(err);
          });
      }).then(() => {
        const renderer = new DisputeRenderer({
          disputeId: dispute.id,
        });

        function fail(step) {
          return err => {
            Sentry.captureException(err);
            logger.error(
              'Error during [step=%s] while rendering [dispute=%s]',
              step,
              dispute.id,
              err,
            );
            throw err;
          };
        }

        return renderer
          .save()
          .catch(fail('SAVING'))
          .then(() => {
            return renderer
              .render(dispute)
              .catch(fail('RENDERING'))
              .then(() => {
                return DisputeRenderer.query()
                  .where({ id: renderer.id })
                  .include('attachments')
                  .then(([_disputeRenderer]) => {
                    return renderer.buildZip(_disputeRenderer).catch(fail('BUILDING ZIP'));
                  });
              });
          })
          .then(() => {
            return renderer;
          });
      });
    },

    async setForm({ formName, fieldValues, _isDirty }) {
      if (!formName) {
        throw new Error('The formName is required');
      }

      if (!_.isObjectLike(fieldValues)) {
        throw new Error('The form fieldValues are invalid');
      }

      if (_isDirty) {
        this.data._forms = {};
        this.data._forms[formName] = fieldValues;
      } else {
        try {
          await this.validateForm(fieldValues);
        } catch (e) {
          // Save the form as a dirty form anyway so that we can tell the user
          // what went wrong during the validation and they can fix it without
          // losing any progress on filling out the form
          await this.setForm({ formName, fieldValues, _isDirty: true });
          throw e;
        }

        delete this.data._forms;
        this.data.forms = {};
        this.data.forms[formName] = fieldValues;
      }

      return this;
    },

    setDisputeProcess({ process, processCity }) {
      if (!process) {
        throw new Error('The process type is required');
      }

      this.data.disputeProcess = process;

      if (processCity) {
        this.data.disputeProcessCity = processCity;
      }

      return this;
    },

    async addAttachment(name, filePath) {
      const dispute = this;

      this.data.attachments = this.data.attachments || [];

      const da = new DisputeAttachment({
        type: 'Dispute',
        foreignKey: this.id,
      });

      // Krypton is horrible.
      // We have to save the attachment so that it has an id before we can give it a file...
      await da.save();
      await da.attach('file', filePath);
      await da.save();

      const path = da.file.url('original');
      const fullPath = basePath + path;
      const attachment = {
        id: da.id,
        name,
        path: da.file.url('original'),
        fullPath,
      };

      if (da.file.exists('thumb')) {
        attachment.thumb = da.file.url('thumb');
      }

      dispute.data.attachments.push(attachment);

      await dispute.save();
      return da;
    },

    removeAttachment(id) {
      const dispute = this;

      if (!dispute.attachments) {
        throw new Error("Dispute doesn't have any attachments");
      }

      const attachments = dispute.attachments.filter(attachment => attachment.id === id);

      if (attachments.length === 0) {
        throw new Error('Attachment not found');
      }

      return attachments[0].destroy().then(() => {
        const dataAttachment = dispute.data.attachments.filter(
          attachment => attachment.id === id,
        )[0];

        const index = dispute.data.attachments.indexOf(dataAttachment);

        dispute.data.attachments.splice(index, 1);

        return dispute.save();
      });
    },

    /**
     * Update the list of admins assigned to this dispute. Removes all admins
     * who are not present in the array of ids and assigns new ones.
     * @param {string[]} adminIds Array of admin ids
     * @return {Promise<void>}
     */
    async updateAdmins(requestedAdminIds) {
      const admins = await User.knex()
        .table('Users')
        .whereIn('id', requestedAdminIds)
        .andWhere('admin', true);
      // Ensure we ignore bad ids and only allow admin ids
      const adminIds = admins.map(({ id }) => id);
      const assignedAdminIds = _.map(this.admins, 'id');
      const adminIdsToInsert = _.difference(adminIds, assignedAdminIds);
      const adminIdsToRemove = _.difference(assignedAdminIds, adminIds);
      const knex = Dispute.knex();

      await Dispute.transaction(trx =>
        knex
          .table('AdminsDisputes')
          .transacting(trx)
          .whereNotIn('admin_id', adminIds)
          .andWhere('dispute_id', this.id)
          .delete()
          .then(() =>
            knex
              .table('AdminsDisputes')
              .transacting(trx)
              .insert(
                adminIdsToInsert.map(id => ({
                  dispute_id: this.id,
                  admin_id: id,
                })),
              ),
          )
          .then(trx.commit)
          .catch(trx.rollback),
      );

      const usernamesToInvite = admins.reduce(
        (toInvite, a) => (adminIdsToInsert.includes(a.id) ? [...toInvite, a.username] : toInvite),
        [],
      );

      const usernamesToUninvite = this.admins.reduce(
        (toUninvite, a) =>
          (adminIdsToRemove.includes(a.id) ? [...toUninvite, a.username] : toUninvite),
        [],
      );

      // This.... could present some problems with rate limiting
      // but this endpoint will not get hit often with more than one
      // change, so it shouldn't be a problem...
      return Promise.all([
        ...usernamesToInvite.map(user =>
          discourse.topics.invite(this.disputeThreadId, { user }).catch(e => {
            Sentry.captureException(e);
            logger.error(
              'Failed to invite [user=%s] to [thread=%s] for [dispute=%s]',
              user,
              this.disputeThreadId,
              this.id,
            );
          }),
        ),
        ...usernamesToUninvite.map(user =>
          discourse.topics
            .removeAllowedUser(this.disputeThreadId, user)
            .then(() =>
              logger.info(
                'Uninvited [user=%s] to [thread=%s] for [dispute=%s]',
                user,
                this.disputeThreadId,
                this.id,
              ),
            )
            .catch(e => {
              Sentry.captureException(e);
              logger.error(
                'Failed to uninvite [user=%s] to [thread=%s] for [dispute=%s]',
                user,
                this.disputeThreadId,
                this.id,
              );
            }),
        ),
      ]);
    },

    /**
     * Compiles a two lists of the administrators on the platform,
     * those already assigned to the dispute and those unassigned,
     * or "available" to be assigned.
     * @return {Promise<{ assigned: User[], available: User[] }>}
     */
    async getAssignedAndAvailableAdmins() {
      const assignedIds = this.admins.map(a => a.id);
      const disputeAdmins = await User.getAdmins();

      return disputeAdmins.reduce(
        ({ assigned, available }, admin) => {
          const isAssigned = assignedIds.includes(admin.id);
          return {
            assigned: isAssigned ? [...assigned, admin] : assigned,
            available: !isAssigned ? [...available, admin] : available,
          };
        },
        { assigned: [], available: [] },
      );
    },

    validateForm(newForm) {
      const config = filterDependentFields(newForm, getCheckitConfig(this));
      return new Checkit(config).validate(newForm);
    },

    destroy() {
      this.deactivated = true;

      return Promise.all([this.save(), Dispute.closeDiscourseThread(this)]);
    },

    /**
     * Normalizes and returns creditor information
     */
    creditor() {
      const defaultCreditor = { name: '' };
      const {
        data: { forms },
      } = this;

      if (!forms) {
        return defaultCreditor;
      }
      const form = forms['personal-information-form'];
      const tool = this.disputeTool;

      switch (tool.slug) {
        case 'general-debt-dispute':
          return {
            name: form['agency-name'],
            address: form['agency-address'],
            city: form['agency-city'],
            state: form['agency-state'],
            zip: form['agency-zip-code'],
          };
        case 'credit-report-dispute':
          return {
            name: form.currentCreditor,
          };
        case 'private-student-loan-dispute':
          return {
            name: form['firm-name'],
            address: form['firm-address'],
            city: form['firm-city'],
            state: form['firm-state'],
            zip: form['firm-zip-code'],
          };
        default:
          return defaultCreditor;
      }
    },
  },
});

// filter out deactivated disputes by default
Dispute.oldQuery = Dispute.query;
Dispute.query = (knex, includeDeactivated = false) => {
  const query = Dispute.oldQuery(knex);
  return includeDeactivated ? query : query.andWhere({ deactivated: false });
};

module.exports = Dispute;
