const { uniq, flatten, isNil, identity } = require('lodash');
const { join } = require('path');
const DebtCollectiveMessage = require('./DebtCollectiveMessage');
const discourse = require('$lib/discourse');

/**
 * Proxies the normal email sending function to send messages
 * using the discourse api instead of the regular transport.
 *
 * Important to note that the recipients must all be _real_
 * discourse users. The `to` and `from` properties in the constructor
 * configuration object should be strings or arrays of strings
 * of discourse usernames. Duplicates are filtered out before
 * the message is sent.
 *
 * This will ultimately produce a private topic in Discourse
 * in which the `system` user and all the users in the
 * `from` and `to` configuration fields are included. If this doesn't
 * make sense, please take some time to understand how Discourse
 * treats private messages between users. At this time it is not
 * possible to prevent the `system` user from being included in
 * the private message.
 *
 * @abstract
 */
class DiscourseMessage extends DebtCollectiveMessage {
  constructor(name, topicId, config) {
    super(name, config);
    this.isThreaded = !isNil(topicId);
    this.topicId = topicId;
  }

  get targetUsernames() {
    return uniq(flatten([this.to, this.from]).filter(identity)).join(',');
  }

  get topicIdOrUsernames() {
    return this.isThreaded
      ? { topic_id: this.topicId }
      : { target_usernames: this.targetUsernames };
  }

  /**
   * Sends the discourse message between one to many people
   * @param {string} html Body of the email to send
   * @returns {Promise<{ post: DiscourseMessagePostResult }>}
   * A promise representing the completion of the email send operation
   */
  send(html = this.render()) {
    return discourse.admin.messages.create({
      // Need to ensure the usernames are unique otherwise Discourse blows up
      raw: html,
      title: this.subject,
      archetype: 'private_message',
      ...this.topicIdOrUsernames,
    });
  }

  render(locals = this.locals, templateName = this._name) {
    const getMarkdown = require(join(
      DebtCollectiveMessage.templatesDirectory,
      `${templateName}${templateName.endsWith('.md.js') ? '' : '.md.js'}`,
    ));

    return getMarkdown(locals);
  }
}

module.exports = DiscourseMessage;
