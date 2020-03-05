import { Worker } from 'bullmq';

const worker = new Worker('cleanupDisputes', async job => {
  console.log(job.data);
});

export default worker;
