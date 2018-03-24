const pug = require('pug');
const { join } = require('path');
const nodemailer = require('nodemailer');
const { smtp } = require('../../config/config');
const { sesInstance: SES } = require('../../lib/AWS');
const { Raven, logger } = require('../../lib');

const transport = nodemailer.createTransport(SES !== null ? { SES } : smtp);

/**
 * Base class for sending emails using the default
 * configured nodemailer transport. Should handle logging
 * and enables an easy test shim.
 *
 * @abstract
 * @prop {string} _name Email name
 * @prop {string} from The from address
 * @prop {string} to The to address
 * @prop {string} subject The email's subject
 * @prop {string} text The email's body
 */
class Email {
  /**
   * @param {string} name The name of the email
   * @param {Object} email The email configuration
   * @param {string} email.from The from address
   * @param {string} email.to The to address
   * @param {string} email.subject The subject of the email
   * @param {string} email.text The text of the email
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
    if (Email.SES !== null) {
      config.ses = this.Tags;
    }
    return new Promise((resolve, reject) => {
      Email.transport.sendMail(config, (err, info) => {
        if (err) {
          // Always capture when emails are not sent.
          logger.error(`Unable to send ${this._name}`, this.toString(), err.message || err);
          Raven.captureException(err);
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
    return Email.pug.renderFile(
      join(
        Email.templatesDirectory,
        `${templateName}${templateName.endsWith('.pug') ? '' : '.pug'}`,
      ),
      locals,
    );
  }

  toString() {
    return `
[Email ${this._name}
 Locals: ${JSON.stringify(this._locals, null, 2)}
 To: ${this.to}
 From: ${this.from}
 Subject: ${this.subject}]
`.trim();
  }
}

// Lets us override these during testing
Email.transport = transport;
Email.SES = SES;
Email.templatesDirectory = join(process.cwd(), 'views', 'emails');
Email.pug = pug;

module.exports = Email;
