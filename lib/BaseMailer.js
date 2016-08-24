/* globals Class */

const fs = require('fs');
const path = require('path');
const pug = require('pug');
const _ = require('lodash');

const BaseMailer = Class('BaseMailer')({
  _transport: null,
  _options: null,
  _templates: null,

  transport(transport) {
    if (transport) {
      this._transport = transport;

      return transport;
    }

    let klass = this;

    while (klass && !klass._transport) {
      const proto = Object.getPrototypeOf(klass.prototype);
      klass = proto && proto.constructor;
    }

    if (klass && klass._transport) {
      return klass && klass._transport;
    }

    throw new Error(`${this.className} can't find a nodemailer transport`);
  },

  setMethodTemplate(methodName, templateName) {
    if (!this._templates) {
      this._templates = {};
    }

    this._templates[methodName] = {
      template: path.join(
        process.cwd(),
        'views',
        'mailers',
        `${this.className}`,
        `${templateName}.pug`
      ),
    };

    return this;
  },

  _send(methodName, ...args) {
    let template;

    const defaultOptions = this._options;

    const recipients = args[0];
    const localVars = args[1];

    const options = _.assign(defaultOptions, localVars._options);

    if (this._templates && this._templates[methodName].template) {
      template = this._templates[methodName].template;
    }

    const conventionalTemplate = path.join(
      process.cwd(),
      'views',
      'mailers',
      this.className,
      `${methodName}.pug`
    );

    try {
      fs.accessSync(conventionalTemplate, fs.F_OK);
      template = conventionalTemplate;
    } catch (e) {
      throw new Error(`Method ${methodName} in ${this.className} doesn't have a template`);
    }

    const html = pug.renderFile(template, localVars);

    options.html = html;
    options.to = recipients;

    return this.transport().sendMail(options);
  },
});

module.exports = BaseMailer;
