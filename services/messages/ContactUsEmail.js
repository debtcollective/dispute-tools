const {
  mailers: { contactEmail },
} = require('$config/config');
const DebtCollectiveMessage = require('./DebtCollectiveMessage');

/**
 * Sends contact us emails to the Debt Collective organizers
 */
class ForAdmin extends DebtCollectiveMessage {
  /**
   * @param {string} message Message for the Debt Collective organizers
   * @param {string} email The email address of the visitor contacting the Debt Collective
   * @param {string} name The name of the visitor contact the Debt Collective
   */
  constructor(message, email, name) {
    super('ContactUsEmail.ForAdmin', {
      to: ForAdmin.to,
      // Must send 'from' the contact email as SES requires emails to be verified
      // The name may remain the name of the visitor, however.
      from: `${name} <${contactEmail}>`,
      subject: `${name} has sent a message for the organizers`,
    });

    this.locals = {
      message,
      name,
    };
  }
}

/**
 * Sends a confirmation message to the visitor attempting to contact the organizers
 */
class ForVisitor extends DebtCollectiveMessage {
  /**
   * @param {string} message Message for the Debt Collective organizers
   * @param {string} email The email address of the visitor contacting the Debt Collective
   * @param {string} name The name of the visitor contact the Debt Collective
   */
  constructor(message, email, name) {
    super('ContactUsEmail.ForVisitor', {
      to: `${name} <${email}>`,
      from: ForVisitor.from,
      subject: ForVisitor.subject,
    });

    this.locals = {
      message,
      name,
    };
  }
}

ForVisitor.subject = 'Thank you for contacting us...';
ForAdmin.to = ForVisitor.from = `The Debt Collective Organizers <${contactEmail}>`;

/**
 * Wraps the ForVisitor and ForAdmin emails to make sending both cleaner
 */
class ContactUsEmail {
  /**
   * @param {string} message Message for the Debt Collective organizers
   * @param {string} email The email address of the visitor contacting the Debt Collective
   * @param {string} name The name of the visitor contact the Debt Collective
   */
  constructor(message, email, name) {
    this.forAdmin = new ForAdmin(message, email, name);
    this.forVisitor = new ForVisitor(message, email, name);
  }

  send() {
    return Promise.all([this.forAdmin.send(), this.forVisitor.send()]);
  }

  toString() {
    return `${this.forAdmin.toString()}\n${this.forVisitor.toString()}`;
  }
}

ContactUsEmail.ForAdmin = ForAdmin;
ContactUsEmail.ForVisitor = ForVisitor;

module.exports = ContactUsEmail;