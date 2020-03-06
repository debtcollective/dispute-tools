const { expect } = require('chai');
const _ = require('lodash');
const moment = require('moment');
const { createUser, truncate } = require('$tests/utils');
const CleanupDisputes = require('$jobs/scheduled/CleanupDisputes');
const Dispute = require('$models/Dispute');
const DisputeStatus = require('$models/DisputeStatus');
const DisputeTool = require('$models/DisputeTool');

const { worker, queue } = CleanupDisputes;

describe('CleanupDisputes', () => {
  let user;

  before(async () => {
    user = await createUser();
  });

  beforeEach(() => truncate(Dispute));

  after(async () => {
    await worker.close();
    await queue.close();
  });

  it('clean ups disputes with new status by removing abandoned ones', async () => {
    const tool = await DisputeTool.first();

    // 2 old disputes with new status
    await Promise.all(
      _.times(2, async () => {
        const dispute = await Dispute.createFromTool({
          user,
          disputeToolId: tool.id,
          option: tool.data.options.A ? 'A' : 'none',
        });

        dispute.createdAt = moment().subtract(31, 'days');

        return await dispute.save();
      }),
    );

    // 2 old disputes without new status
    await Promise.all(
      _.times(2, async () => {
        const dispute = await Dispute.createFromTool({
          user,
          disputeToolId: tool.id,
          option: tool.data.options.A ? 'A' : 'none',
        });

        dispute.createdAt = moment().subtract(31, 'days');

        await DisputeStatus.createForDispute(dispute, { status: 'Completed' });

        return await dispute.save();
      }),
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

    const results = await Dispute.query().count('*');
    expect(parseInt(results[0].count, 10)).eq(6);

    // add job to CleanupDisputes queue
    await queue.add('test', { name: 'testJob' });

    return new Promise(resolve => {
      worker.on('completed', async () => {
        console.log('completed');
        const results = await Dispute.query().count('*');

        // we should have deleted only 2 disputes
        expect(parseInt(results[0].count, 10)).eq(4);

        resolve();
      });
    });
  });
});
