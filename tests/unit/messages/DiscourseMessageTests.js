const { expect } = require('chai');

const DiscourseMessage = require('$services/messages/DiscourseMessage');
const discourse = require('$lib/discourse');

describe('DiscourseMessage', () => {
  describe('send', () => {
    let create;
    let created;

    before(() => {
      create = discourse.admin.messages.create;
      discourse.admin.messages.create = c => (created = c);
    });

    beforeEach(() => {
      created = undefined;
    });

    after(() => {
      discourse.admin.messages.create = create;
    });

    describe('from', () => {
      it('should accept a string', () => {
        const m = new DiscourseMessage('Test', null, {
          to: 'foo',
          from: 'bar',
        });

        m.send('');

        expect(created.target_recipients).match(/foo/g);
        expect(created.target_recipients).match(/bar/g);
      });

      it('should accept an array', () => {
        const m = new DiscourseMessage('Test', null, {
          to: 'foo',
          from: ['bar', 'bang', 'baz'],
        });

        m.send('');

        expect(created.target_recipients).match(/foo/g);
        expect(created.target_recipients).match(/bar/g);
        expect(created.target_recipients).match(/bang/g);
        expect(created.target_recipients).match(/baz/g);
      });

      it('should filter duplicate usernames', () => {
        const m = new DiscourseMessage('Test', null, {
          to: 'fooBar',
          from: ['fooBar', 'fooBar', 'fooBar'],
        });

        m.send('');

        expect(created.target_recipients.match(/fooBar/g)).lengthOf(1);
      });

      it('should filter undefined usernames', () => {
        const m = new DiscourseMessage('Test', null, {
          to: 'fooBar',
          from: [undefined, 'twist'],
        });

        m.send('');

        expect(created.target_recipients).match(/fooBar/);
        expect(created.target_recipients).match(/twist/);
        expect(created.target_recipients).not.match(/undefined/);
      });
    });

    describe('send', () => {
      it('should send target_recipients when no topicId was passed in', () => {
        const m = new DiscourseMessage('Test', null, { from: ['test'] });

        m.send('');

        expect(created.target_recipients).eq('test');
        expect(created.topic_id).undefined;
      });

      it('should send the topic id when a topic id is passed in', () => {
        const m = new DiscourseMessage('Test', 40, { from: ['test'] });

        m.send('');

        expect(created.topic_id).eq(40);
        expect(created.target_recipients).undefined;
      });
    });
  });
});
