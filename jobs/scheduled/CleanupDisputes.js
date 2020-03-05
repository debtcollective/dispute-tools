import { Worker, QueueScheduler } from 'bullmq';

const queueName = 'CleanupDisputes';
const queue = new QueueScheduler(queueName);

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

const worker = new Worker(queueName, async job => {
  // get all disputes older than 30 days in New status
  // for each dispute run dispute.delete()
  console.log(job);
});

export default worker;
