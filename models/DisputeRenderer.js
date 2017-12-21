/* globals Class, Krypton, CONFIG, Attachment, Dispute, DisputeRenderer */
/* eslint max-len: 0 */

const path = require('path');
const gm = require('gm').subClass({
  imageMagick: process.env.GM === 'true' || false,
});
const _ = require('lodash');
const Promise = require('bluebird');
const uuid = require('uuid');
const OS = require('os');
const fs = require('fs-extra');
const request = require('request');
const archiver = require('archiver');
const { assignDefaultConfig, basePath } = require('../lib/AWS');
const PrivateAttachmentStorage = require('./PrivateAttachmentStorage');

const disputeRendererData = require(path.join(
  process.cwd(),
  '/lib/data/dispute-renderer/index.js'
));

const DisputeRenderer = Class('DisputeRenderer')
  .inherits(Krypton.Model)
  .includes(Krypton.Attachment)({
    tableName: 'DisputeRenderers',
    data: disputeRendererData,
    attributes: ['id', 'disputeId', 'zipPath', 'zipMeta', 'createdAt', 'updatedAt'],
    attachmentStorage: new PrivateAttachmentStorage(assignDefaultConfig({
      acceptedMimeTypes: ['application/zip', 'application/octet-stream', /application/],
      maxFileSize: 41943040, // 40MB
    })),

    prototype: {
      init(config) {
        Krypton.Model.prototype.init.call(this, config);

        this.hasAttachment({
          name: 'zip',
        });

        return this;
      },
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
        const renderer = this;
        const documents = this._getDocuments(dispute);

        const attachments = [];

        return Promise.each(Object.keys(documents), (document) => Promise.resolve()
          .then(() => {
            const templates = [];

            documents[document].templates.forEach((template) => {
              // console.log('TEMPLATE', path.join(process.cwd(), template.path));
              const templateFile = gm(path.join(process.cwd(), template.path));

              for (const field of Object.keys(template.fields)) {
                const _field = template.fields[field];
                if (_.isFunction(_field)) {
                  _field(templateFile, dispute.data);
                } else {
                  const fieldData = field.split('.');

                  if (
                    dispute.data.forms[fieldData[0]] &&
                    dispute.data.forms[fieldData[0]][fieldData[1]]
                  ) {
                    const fieldValue =
                      dispute.data.forms[fieldData[0]][fieldData[1]];
                    this._printField(templateFile, _field, fieldValue);
                  }
                }
              }

              templates.push(templateFile);
            });

            return templates;
          })
          .then(templates => {
            const convert = gm();

            return Promise.map(templates, template => {
              const templatePath = path.join(OS.tmpdir(), `${uuid.v4()}.png`);
              convert.in(templatePath);

              return new Promise((resolve, reject) => {
                template.write(templatePath, err => {
                  if (err) {
                    return reject(err);
                  }
                  return resolve(convert);
                });
              });
            });
          })
          .then(([convert]) => {
            const filePath = path.join(
              OS.tmpdir(),
              `${document}-${uuid.v4()}.pdf`
            );

            return new Promise((resolve, reject) => {
              convert.density('300', '300').write(filePath, err => {
                if (err) {
                  return reject(err);
                }

                const attachment = new Attachment({
                  type: 'DisputeRenderer',
                  foreignKey: renderer.id,
                  _filePath: filePath,
                });

                attachments.push(attachment);

                return resolve();
              });
            });
          })
          .then(() => Promise.map(attachments, attachment => attachment.save().then(() => attachment.attach('file', attachment._filePath).then(() => attachment.save())))));
      },

      buildZip(_renderer) {
        const renderer = this;

        const zip = archiver.create('zip', {});
        const zipPath = path.join(OS.tmpdir(), `${uuid.v4()}.zip`);
        const writer = fs.createWriteStream(zipPath);

        zip.pipe(writer);

        return Promise.resolve()
          .then(() => Promise.map(_renderer.attachments, (attachment) => new Promise((resolve) => {
            const url = attachment.file.url('original');
            const readStream = request.get(basePath + url);

            return Promise.resolve()
              .then(() => zip.append(readStream, {
                name: `debt-collective-dispute/${attachment.file.meta('original').originalFileName}`,
              }))
              .then(() => resolve());
          }), { concurrency: 1 }))
          .then(() => Dispute.query()
            .where('id', _renderer.disputeId)
            .include('attachments')
            .then(([dispute]) => Promise.map(dispute.attachments, (attachment) => new Promise((resolve) => {
              const url = attachment.file.url('original');
              const readStream = request.get(basePath + url);

              return Promise.resolve()
                .then(() => zip.append(readStream, {
                  name: `debt-collective-dispute/${attachment.file.meta('original').originalFileName}`,
                }))
                .then(() => resolve());
            }), { concurrency: 1 })))
          .then(() => new Promise((resolve, reject) => {
            writer.on('close', (err) => {
              if (err) {
                return reject(err);
              }

              return resolve();
            });

            return zip.finalize();
          }))
          .then(() => renderer.attach('zip', zipPath)
            .then(() => renderer.save().then(([id]) => id)));
      },
    },
  });

module.exports = DisputeRenderer;
