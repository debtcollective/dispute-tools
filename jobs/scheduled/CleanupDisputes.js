const { Worker, Queue, QueueScheduler } = require('bullmq');
const Dispute = require('$models/Dispute');
const _ = require('lodash');
const moment = require('moment');
const { redis } = require('$config/config');

const connection = {
  host: redis.host,
  port: redis.port,
};
const queueName = 'CleanupDisputes';
const queue = new Queue(queueName, { connection });
const queueScheduler = new QueueScheduler(queueName, { connection });

const worker = new Worker(
  queueName,
  async job => {
    // get all disputes older than 30 days in New status
    const removableDisputes = await Dispute.query().where(
      'createdAt',
      '>=',
      moment().subtract(30, 'days'),
    );

    // for each dispute
    _.forEach(removableDisputes, async dispute => {
      // destroy
      await dispute.destroy();

      // close discourse private message
      await Dispute.closeDiscourseThread(dispute);
    });

    console.log(job);
  },
  { connection },
);

worker.on('completed', async job => {
  // notify slack
  console.log(job);
});

worker.on('failed', async job => {
  // notify sentry
  console.log(job);
});

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
