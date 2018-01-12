// Load Application
require(require('path').join(process.cwd(), '/lib/core'));

const createQueue = require('./utils').createQueue;
const userLocationWorker = require('./userLocationWorker');

const userLocationQueue = createQueue('userLocation');

userLocationQueue.on('ready', () => {
  userLocationQueue.process(userLocationWorker);
});
userLocationQueue.on('succeeded', job => {
  console.log(`Job ${job.id} succeeded`);
});
userLocationQueue.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed with error ${err.message}`);
});
userLocationQueue.on('error', err => {
  console.log(`A queue error happened: ${err.message}`);
});
userLocationQueue.on('stalled', jobId => {
  console.log(`Job ${jobId} stalled and will be reprocessed`);
});
userLocationQueue.on('retrying', (job, err) => {
  console.log(
    `Job ${job.id} failed with error ${err.message} but is being retried!`,
  );
});

console.log('Workers running');
