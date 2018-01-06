const Queue = require('bee-queue');

const createQueue = queueName => new Queue(queueName, {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
  },
});

module.exports = {
  createQueue,
};
