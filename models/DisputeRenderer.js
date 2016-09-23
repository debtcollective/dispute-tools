/* globals Class, Krypton, CONFIG, Attachment, Dispute, DisputeRenderer */
const path = require('path');
const gm = require('gm').subClass({ imageMagick: true });
const _ = require('lodash');
const Promise = require('bluebird');
const uuid = require('uuid');
const OS = require('os');
// const fs = require('fs-extra');

const disputeRendererData = require(path
  .join(process.cwd(), '/lib/data/dispute-renderer/index.js'));

const DisputeRenderer = Class('DisputeRenderer')
  .inherits(Krypton.Model)
  .includes(Krypton.Attachment)({
    tableName: 'DisputeRenderers',
    data: disputeRendererData,
    attributes: ['id', 'disputeId', 'zipPath', 'zipMeta', 'createdAt', 'updatedAt'],

    prototype: {
      _getDocuments(dispute) {
        return this.constructor.data[dispute.disputeToolId][dispute.data.option].documents;
      },

      _printField(template, field, value) {
        const font = field.font || 'Arial';
        const size = field.fontSize || 38;

        template
          .font(font)
          .fontSize(size)
          .drawText(field.x, field.y, value);
      },

      render(dispute) {
        const documents = this._getDocuments(dispute);

        const attachments = [];

        return Promise.each(Object.keys(documents), (document) => {
          return Promise.resolve()
            .then(() => {
              const templates = [];

              documents[document].templates.forEach((template) => {
                const templateFile = gm(path.join(process.cwd(), template.path));

                for (const field of Object.keys(template.fields)) {
                  const _field = template.fields[field];
                  if (_.isFunction(_field)) {
                    _field(templateFile, dispute.data);
                  } else {
                    const fieldData = field.split('.');

                    if (dispute.data.forms[fieldData[0]] &&
                       dispute.data.forms[fieldData[0]][fieldData[1]]) {

                      const fieldValue = dispute.data.forms[fieldData[0]][fieldData[1]];

                      this._printField(templateFile, _field, fieldValue);
                    }
                  }
                }

                templates.push(templateFile);
              });

              return templates;
            })
            .then((templates) => {
              const convert = gm();

              return Promise.map(templates, (template) => {
                const templatePath = path.join(OS.tmpdir(), `${uuid.v4()}.png`);
                convert.in(templatePath);

                return new Promise((resolve, reject) => {
                  template.write(templatePath, (err) => {
                    if (err) {
                      return reject(err);
                    }

                    return resolve(convert);
                  });
                });
              });
            })
            .then(([convert]) => {
              const filePath = path.join(OS.tmpdir(), `${uuid.v4()}.pdf`);

              return new Promise((resolve, reject) => {
                convert
                  .density('300')
                  .write(filePath, (err) => {
                    if (err) {
                      return reject(err);
                    }

                    const attachment = new Attachment({
                      type: 'DisputeRenderer',
                      foreignKey: dispute.id,
                      _filePath: filePath,
                    });

                    attachments.push(attachment);

                    return resolve();
                  });
              });
            });
        })
        .then(() => {
          return Promise.map(attachments, (attachment) => {
            return attachment.save()
              .then(() => {
                return attachment.attach('file', attachment._filePath)
                  .then(() => {
                    return attachment.save();
                  });
              });
          });
        })
        .then(() => {
          return DisputeRenderer.query()
            .where({ id: dispute.id })
            .include('attachments');
        });
      },
    },
  });

module.exports = DisputeRenderer;
