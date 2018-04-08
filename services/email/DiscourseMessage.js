const _ = require('lodash');
const { join } = require('path');
const Email = require('./Email');
const discourse = require('../../lib/discourse');

/**
 * Proxies the normal email sending function to send messages
 * using the discourse api instead of the regular transport.
 *
 * @abstract
 */
class DiscourseMessage extends Email {
  /**
   * Sends the discourse message between one to many people
   * @param {string} html Body of the email to send
   */
  send(html = this.render()) {
    return discourse.admin.messages.create({
      // Need to ensure the usernames are unique otherwise Discourse blows up
      target_usernames: _.uniq(_.flatten([this.to, this.from]).filter(_.identity)).join(','),
      raw: html,
      title: this.subject,
      archetype: 'private_message',
    });
  }

  render(locals = this.locals, templateName = this._name) {
    const getMarkdown = require(join(
      Email.templatesDirectory,
      `${templateName}${templateName.endsWith('.md.js') ? '' : '.md.js'}`,
    ));

    return getMarkdown(locals);
  }
}

module.exports = DiscourseMessage;
