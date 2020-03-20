const { uniq, flatten, isNil, identity } = require('lodash');
const { join } = require('path');
const DebtCollectiveMessage = require('./DebtCollectiveMessage');
const { Sentry, logger, discourse } = require('$lib');

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
 * Config can be undefined. In the cases of most discourse messages
 * the only thing that should be passed in is the topicId, which
 * makes the to, from, and subject fields irrelevant.
 *
 * @abstract
 */
class DiscourseMessage extends DebtCollectiveMessage {
  constructor(name, topicId, config = {}) {
    super(name, config);
    this.isThreaded = !isNil(topicId);
    this.topicId = topicId;
  }

  /**
   * Handles the list of usernames/groups and turns them into
   * the comma delimited list that discourse expects.
   * @return {string} a comma delimited list of usernames and groups
   */
  get targetUsernames() {
    return uniq(flatten([this.to, this.from]).filter(identity)).join(',');
  }

  get topicIdOrUsernames() {
    return this.isThreaded
      ? { topic_id: this.topicId }
      : { target_usernames: this.targetUsernames, title: this.subject };
  }

  /**
   * Sends the discourse message between one to many people
   * @param {string} markdown Raw markdown of the message body
   * @returns {Promise<{ post: DiscourseMessagePostResult }>}
   *                           Promise representing the completion of
   *                           the message send operation
   */
  async send(markdown = this.render()) {
    const response = await discourse.admin.messages.create({
      raw: markdown,
      archetype: 'private_message',
      ...this.topicIdOrUsernames,
    });

    return response.body;
  }

  /**
   * Same as `send` but automatically recovers from and logs errors.
   * Useful for when you don't really care for programatic reasons whether
   * the message you're sending was successful but still want to capture
   * the exception. Cuts down on boilerplate
   * @param  {string} markdown Raw markdown of the message body
   * @return {Promise<{ post: DiscourseMessagePostResult }>}
   *                          Promise representing the completion of the
   *                          message send operation. In this case the promise
   *                          will also resolve and never reject.
   */
  async safeSend(markdown = this.render()) {
    try {
      await this.send(markdown);
    } catch (e) {
      Sentry.captureException(e);
      logger.error('Failed to send message %s with locals', this._name, { ...this.locals }, e);
    }
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
