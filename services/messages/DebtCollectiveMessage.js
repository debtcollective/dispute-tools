const pug = require('pug');
const { join } = require('path');
const nodemailer = require('nodemailer');
const { smtp } = require('$config/config');
const { sesInstance: SES } = require('$lib/AWS');
const { Sentry, logger } = require('$lib');

const transport = nodemailer.createTransport(SES !== null ? { SES } : smtp);

/**
 * Base class for sending emails using the default
 * configured nodemailer transport. Should handle logging
 * and enables an easy test shim.
 *
 * @abstract
 * @prop {string} _name DebtCollectiveMessage name
 * @prop {string} from The from address
 * @prop {string} to The to address
 * @prop {string} subject The email's subject
 * @prop {string} text The email's body
 * @prop {Object} locals Local variables passed to the HTML renderer
 */
class DebtCollectiveMessage {
  /**
   * @param {string} name The name of the email
   * @param {Object} config The message configuration
   * @param {string} config.from The from address or discourse username(s)
   * @param {string} config.to The to address or discourse username(s)
   * @param {string} config.subject The subject of the message
   */
  constructor(name, { to, from, subject }) {
    this._name = name;
    this.to = to;
    this.from = from;
    this.subject = subject;
  }

  /**
   * Wraps the default configured nodemailer transport to send a message.
   *
   * @public
   *
   * @return {Promise<any>} Promise resolving in the sent email information
   */
  send(html = this.render()) {
    const config = { from: this.from, to: this.to, subject: this.subject, html };
    if (DebtCollectiveMessage.SES !== null) {
      config.ses = this.Tags;
    }
    return new Promise((resolve, reject) => {
      DebtCollectiveMessage.transport.sendMail(config, (err, info) => {
        if (err) {
          // Always capture when emails are not sent.
          logger.error(`Unable to send ${this._name}`, this.toString(), err.message || err);
          Sentry.captureException(err);
          reject(err);
        } else {
          logger.info(`Successfully sent ${this._name}`, this.toString(), info);
          resolve(info);
        }
      });
    });
  }

  get Tags() {
    return {
      Tags: [
        {
          Name: this.to,
          Value: this.subject,
        },
        {
          Name: 'name',
          Value: this._name,
        },
      ],
    };
  }

  /**
   * Gets the locals for the pug template.
   */
  get locals() {
    return this._locals;
  }

  /**
   * Sets the locals for the pug template.
   * Expected to be used by the implementing class during construction.
   */
  set locals(l) {
    this._locals = l;
  }

  /**
   * Renders the email using the configured email name as the filename for the template.
   * @param {Object} locals Pug locals for the email template
   * @return {string} The rendered HTML string
   */
  render(locals = this.locals, templateName = this._name) {
    return DebtCollectiveMessage.pug.renderFile(
      join(
        DebtCollectiveMessage.templatesDirectory,
        `${templateName}${templateName.endsWith('.pug') ? '' : '.pug'}`,
      ),
      locals,
    );
  }

  toString() {
    return `
[DebtCollectiveMessage ${this._name}
 Locals: ${JSON.stringify(this._locals, null, 2)}
 To: ${this.to}
 From: ${this.from}
 Subject: ${this.subject}]
`.trim();
  }
}

// Lets us override these during testing
DebtCollectiveMessage.transport = transport;
DebtCollectiveMessage.SES = SES;
DebtCollectiveMessage.templatesDirectory = join(process.cwd(), 'views', 'messages');
DebtCollectiveMessage.pug = pug;

module.exports = DebtCollectiveMessage;
