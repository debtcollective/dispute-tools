/* globals Class */

const fs = require('fs');
const path = require('path');
const pug = require('pug');
const _ = require('lodash');

const BaseMailer = Class('BaseMailer')({
  _transport: null,
  _layout: null,
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

  layout(layout) {
    if (layout) {
      this._layout =  path.join(
        process.cwd(),
        'views',
        'mailers',
        'layouts',
        `${layout}.pug`
      );
    }

    if (this._layout) {
      return this._layout;
    }

    const conventionalLayout = path.join(
      process.cwd(),
      'views',
      'mailers',
      'layouts',
      `${this.className}.pug`
    );

    try {
      fs.accessSync(conventionalLayout, fs.F_OK);
      return conventionalLayout;
    } catch (e) {
      if (this._layout) {
        return this._layout;
      }

      return null;
    }
  },

  setMethodTemplate(methodName, templateName, layoutName) {
    if (!this._templates) {
      this._templates = {};
    }

    let layout = this.layout();

    if (layoutName) {
      layout = path.join(
        process.cwd(),
        'views',
        'mailers',
        'layouts',
        `${layoutName}.pug`
      );
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

    this._templates[methodName].layout = layout;

    return this;
  },

  _send(methodName, ...args) {
    let template;
    let layout;

    const defaultOptions = this._options;

    const recipients = args[0];
    const localVars = args[1];

    const options = _.assign(localVars._options, defaultOptions);

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

    if (this._templates && this._templates[methodName].layout) {
      layout = this._templates[methodName].layout;
    } else {
      layout = this.layout();
    }

    localVars.layout = layout;

    const html = pug.renderFile(template, localVars);

    options.html = html;
    options.to = recipients;

    return this.transport().sendMail(options);
  },
});

module.exports = BaseMailer;
