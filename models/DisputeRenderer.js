/* globals Class, Krypton, CONFIG, Attachment, Dispute, DisputeRenderer */
/* eslint max-len: 0 */

const path = require('path');
const gm = require('gm').subClass({ imageMagick: config('image-magick') || false });
const _ = require('lodash');
const Promise = require('bluebird');
const uuid = require('uuid');
const OS = require('os');
const fs = require('fs-extra');
const request = require('request');
const archiver = require('archiver');

const LOCAL_URI_REGEXP = /^\//;
const REMOTE_URI_REGEXP = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

const disputeRendererData = require(path
  .join(process.cwd(), '/lib/data/dispute-renderer/index.js'));

const DisputeRenderer = Class('DisputeRenderer')
  .inherits(Krypton.Model)
  .includes(Krypton.Attachment)({
    tableName: 'DisputeRenderers',
    data: disputeRendererData,
    attributes: ['id', 'disputeId', 'zipPath', 'zipMeta', 'createdAt', 'updatedAt'],
    attachmentStorage: new Krypton.AttachmentStorage.Local({
      acceptedMimeTypes: ['application/zip', 'application/octet-stream', /application/],
      maxFileSize: 20971520, // 20MB
    }),

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

        return Promise.each(Object.keys(documents), (document) => {
          return Promise.resolve()
            .then(() => {
              const templates = [];

              documents[document].templates.forEach((template) => {
                console.log('TEMPLATE', path.join(process.cwd(), template.path));
                const templateFile = gm(path.join(process.cwd(), template.path));

                for (const field of Object.keys(template.fields)) {
                  const _field = template.fields[field];
                  if (_.isFunction(_field)) {
                    console.log('_field', field);
                    _field(templateFile, dispute.data);
                  } else {
                    const fieldData = field.split('.');

                    if (dispute.data.forms[fieldData[0]] &&
                       dispute.data.forms[fieldData[0]][fieldData[1]]) {
                      const fieldValue = dispute.data.forms[fieldData[0]][fieldData[1]];
                      console.log('_printField', _field);
                      this._printField(templateFile, _field, fieldValue);
                    }
                  }
                }

                templates.push(templateFile);
              });

              console.log('TEMPLATE OK');

              return templates;
            })
            .then((templates) => {
              const convert = gm();

              return Promise.map(templates, (template) => {
                const templatePath = path.join(OS.tmpdir(), `${uuid.v4()}.png`);
                console.log('CONVERT', templatePath);
                convert.in(templatePath);

                return new Promise((resolve, reject) => {
                  template.write(templatePath, (err) => {
                    if (err) {
                      return reject(err);
                    }
                    console.log('CONVERT OK');
                    return resolve(convert);
                  });
                });
              });
            })
            .then(([convert]) => {
              const filePath = path.join(OS.tmpdir(), `${document}-${uuid.v4()}.pdf`);

              return new Promise((resolve, reject) => {
                console.log('WRITE', filePath);
                convert
                  .density('300')
                  .write(filePath, (err) => {
                    if (err) {
                      return reject(err);
                    }

                    const attachment = new Attachment({
                      type: 'DisputeRenderer',
                      foreignKey: renderer.id,
                      _filePath: filePath,
                    });

                    attachments.push(attachment);

                    console.log('WRITE OK');

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
        });
      },

      buildZip(_renderer) {
        const renderer = this;

        const zip = archiver.create('zip', {});
        const zipPath = path.join(OS.tmpdir(), `${uuid.v4()}.zip`);
        const writer = fs.createWriteStream(zipPath);

        zip.pipe(writer);

        return Promise.resolve()
          .then(() => {
            return Promise.map(_renderer.attachments, (attachment) => {
              return new Promise((resolve) => {
                let readStream;

                const url = attachment.file.url('original');

                if (LOCAL_URI_REGEXP.test(url)) {
                  readStream = fs.createReadStream(path.join(process.cwd(), 'public', url));
                } else if (REMOTE_URI_REGEXP.test(url)) {
                  readStream = request.get(url);
                }

                return Promise.resolve()
                  .then(() => {
                    return zip.append(readStream, {
                      name: `debt-collective-dispute/${attachment.file.meta('original').originalFileName}`,
                    });
                  })
                  .then(() => {
                    return resolve();
                  });
              });
            }, { concurrency: 1 });
          })
          .then(() => {
            return Dispute.query()
              .where('id', _renderer.disputeId)
              .include('attachments')
              .then(([dispute]) => {
                return Promise.map(dispute.attachments, (attachment) => {
                  return new Promise((resolve) => {
                    let readStream;

                    const url = attachment.file.url('original');

                    if (LOCAL_URI_REGEXP.test(url)) {
                      readStream = fs.createReadStream(path.join(process.cwd(), 'public', url));
                    } else if (REMOTE_URI_REGEXP.test(url)) {
                      readStream = request.get(url);
                    }

                    return Promise.resolve()
                      .then(() => {
                        return zip.append(readStream, {
                          name: `debt-collective-dispute/${attachment.file.meta('original').originalFileName}`,
                        });
                      })
                      .then(() => {
                        return resolve();
                      });
                  });
                }, { concurrency: 1 });
              });
          })
          .then(() => {
            return new Promise((resolve, reject) => {
              writer.on('close', (err) => {
                if (err) {
                  return reject(err);
                }

                return resolve();
              });

              return zip.finalize();
            });
          })
          .then(() => {
            return renderer.attach('zip', zipPath)
              .then(() => {
                return renderer.save().then(([id]) => {
                  return id;
                });
              });
          });
      },
    },
  });

module.exports = DisputeRenderer;
