const { expect } = require('chai');
const _ = require('lodash');
const moment = require('moment');
const { createUser } = require('$tests/utils');
const CleanupDisputes = require('$jobs/scheduled/CleanupDisputes');
const Dispute = require('$models/Dispute');
const DisputeTool = require('$models/DisputeTool');

const { worker, queue } = CleanupDisputes;

describe('CleanupDisputes', () => {
  let user;

  before(async () => {
    user = await createUser();
  });

  beforeEach(async () => {});

  afterEach(async () => {
    await worker.close();
    await queue.close();
  });

  it('clean ups disputes by removing abandoned ones', async () => {
    const tool = await DisputeTool.first();

    // create 5 disputes
    // 3 old disputes
    await Promise.all(
      _.times(
        3,
        async () =>
          await Dispute.createFromTool({
            user,
            disputeToolId: tool.id,
            option: tool.data.options.A ? 'A' : 'none',
            createdAt: moment().subtract(30, 'days'),
          }),
      ),
    );

    // 2 that shouldn't be deleted
    await Promise.all(
      _.times(
        2,
        async () =>
          await Dispute.createFromTool({
            user,
            disputeToolId: tool.id,
            option: tool.data.options.A ? 'A' : 'none',
          }),
      ),
    );

    let results = await Dispute.query().count('*');
    expect(results[0].count).eq('5');

    // add a job to the queue to delete these disputes
    await queue.waitUntilReady();
    await worker.waitUntilReady();

    // add job to CleanupDisputes queue
    await queue.add('test', { name: 'testJob' });

    // check that disputes were deleted
    results = await Dispute.query().count('*');
    expect(results[0].count).eq('2');
  });
});
