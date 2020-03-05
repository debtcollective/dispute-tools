const { Worker, Queue, QueueScheduler } = require('bullmq');
const Dispute = require('$models/Dispute');
const _ = require('lodash');
const moment = require('moment');
const { redis } = require('$config/config');
const { Sentry, logger } = require('$lib');

const connection = {
  host: redis.host,
  port: redis.port,
};
const queueName = 'CleanupDisputes';
const queue = new Queue(queueName, { connection });
const queueScheduler = new QueueScheduler(queueName, { connection });

const worker = new Worker(
  queueName,
  async () => {
    // get all disputes older than 30 days with New status
    const knex = Dispute.knex();
    const removableDisputes = await Dispute.query()
      .select('Disputes.*')
      .join(
        'DisputeStatuses',
        'DisputeStatuses.id',
        knex.raw(
          '(SELECT id FROM "DisputeStatuses" WHERE dispute_id = "Disputes".id ORDER by updated_at desc limit 1)',
        ),
      )
      .where('Disputes.created_at', '<=', moment().subtract(30, 'days'))
      .andWhere('DisputeStatuses.status', 'New');
    const removableDisputesCount = removableDisputes.length;

    logger.info(`CleanupDisputes job will remove ${removableDisputesCount} disputes`);

    // destroy disputes using forEach
    return await Promise.all(_.map(removableDisputes, async dispute => await dispute.destroy()));
  },
  { connection },
);

worker.on('completed', async () => {
  // TODO: notify slack
});

worker.on('failed', async job => Sentry.captureMessage(job.failedReason));

const start = () => {
  // Repeat job once every day at 3:15 (am)
  queue.add(
    queueName,
    { name: queueName },
    {
      repeat: {
        cron: '15 3 * * *',
      },
    },
  );
};

module.exports = {
  queue,
  queueScheduler,
  start,
  worker,
};
