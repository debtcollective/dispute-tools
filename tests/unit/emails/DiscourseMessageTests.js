const { expect } = require('chai');

const DiscourseMessage = require('../../../services/email/DiscourseMessage');
const discourse = require('../../../lib/discourse');

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
        const m = new DiscourseMessage('Test', {
          to: 'foo',
          from: 'bar',
        });

        m.send('');

        expect(created.target_usernames).match(/foo/g);
        expect(created.target_usernames).match(/bar/g);
      });

      it('should accept an array', () => {
        const m = new DiscourseMessage('Test', {
          to: 'foo',
          from: ['bar', 'bang', 'baz'],
        });

        m.send('');

        expect(created.target_usernames).match(/foo/g);
        expect(created.target_usernames).match(/bar/g);
        expect(created.target_usernames).match(/bang/g);
        expect(created.target_usernames).match(/baz/g);
      });

      it('should filter duplicate usernames', () => {
        const m = new DiscourseMessage('Test', {
          to: 'fooBar',
          from: ['fooBar', 'fooBar', 'fooBar'],
        });

        m.send('');

        expect(created.target_usernames.match(/fooBar/g)).lengthOf(1);
      });

      it('should filter undefined usernames', () => {
        const m = new DiscourseMessage('Test', {
          to: 'fooBar',
          from: [undefined, 'twist'],
        });

        m.send('');

        expect(created.target_usernames).match(/fooBar/);
        expect(created.target_usernames).match(/twist/);
        expect(created.target_usernames).not.match(/undefined/);
      });
    });
  });
});
