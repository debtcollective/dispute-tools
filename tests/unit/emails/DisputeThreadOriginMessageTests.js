const { expect } = require('chai');
const { createUser, createDispute, testGroups } = require('$tests/utils');
const { DisputeThreadOriginMessage } = require('$services/email');
const DisputeTool = require('$models/DisputeTool');

describe(DisputeThreadOriginMessage.name, () => {
  let dispute;
  let member;
  let disputeTool;
  let message;

  before(async () => {
    member = await createUser();
    disputeTool = await DisputeTool.first();
    dispute = await createDispute(member, disputeTool);
    message = new DisputeThreadOriginMessage(member, dispute, disputeTool);
  });

  describe('subject', () => {
    it('should be the right format', () => {
      expect(message.subject).eq(
        `${dispute.readableId} - ${member.name} - ${disputeTool.readableName}`,
      );
    });
  });

  describe('to', () => {
    it('should be the member username', () => {
      expect(message.to).eq(member.username);
    });
  });

  describe('send', () => {
    let sent;

    before(async () => {
      ({ sent } = await message.send());
    });

    it('should send to the coordinators', () => {
      expect(sent).contain(
        `name=\\"target_usernames\\"\\r\\n\\r\\n${member.username},${
          testGroups.dispute_coordinator.members
        }`,
      );
    });

    it('should not send a topic id', () => {
      expect(sent).not.contain('topic_id');
    });
  });
});
