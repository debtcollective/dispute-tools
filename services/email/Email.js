const nodemailer = require('nodemailer');
const { smtp } = require('../../config/config');
const { sesInstance: SES } = require('../../lib/AWS');

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
  constructor(name, { to, from, subject, text }) {
    this._name = name;
    this.to = to;
    this.from = from;
    this.subject = subject;
    this.text = text;
  }

  /**
   * Wraps the default configured nodemailer transport to send a message.
   *
   * @protected
   *
   * @return {Promise<any>} Promise resolving in the sent email information
   */
  send() {
    const config = { from: this.from, to: this.to, subject: this.subject, text: this.text };
    if (Email.SES !== null) {
      config.ses = this.Tags;
    }
    return new Promise((resolve, reject) => {
      Email.transport.sendMail(config, (err, info) => {
        if (err) reject(err);
        else resolve(info);
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
}

// Lets us override these during testing
Email.transport = transport;
Email.SES = SES;

module.exports = Email;
