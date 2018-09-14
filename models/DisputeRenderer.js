/* globals Class, Krypton, Attachment */
/* eslint max-len: 0 */

const path = require('path');
const Promise = require('bluebird');
const uuid = require('uuid');
const OS = require('os');
const fs = require('fs-extra');
const request = require('request');
const archiver = require('archiver');
const { render } = require('$services/render');
const Dispute = require('$models/Dispute');

const LOCAL_URI_REGEXP = /^\//;
const REMOTE_URI_REGEXP = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
const { assignDefaultConfig } = require('$lib/AWS');
const PrivateAttachmentStorage = require('$models/PrivateAttachmentStorage');

const DisputeRenderer = Class('DisputeRenderer')
  .inherits(Krypton.Model)
  .includes(Krypton.Attachment)({
  tableName: 'DisputeRenderers',
  attributes: ['id', 'disputeId', 'zipPath', 'zipMeta', 'createdAt', 'updatedAt'],
  attachmentStorage: new PrivateAttachmentStorage(
    assignDefaultConfig({
      acceptedMimeTypes: ['application/zip', 'application/octet-stream', /application/],
      maxFileSize: 41943040, // 40MB
    }),
  ),

  prototype: {
    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.hasAttachment({
        name: 'zip',
      });

      return this;
    },

    async render(dispute) {
      const documents = await render(dispute);

      const attachments = documents.reduce(
        (acc, files) => [
          ...acc,
          ...files.map(
            ({ rendered }) =>
              new Attachment({
                type: 'DisputeRenderer',
                foreignKey: this.id,
                _filePath: rendered,
              }),
          ),
        ],
        [],
      );

      return Promise.map(attachments, attachment =>
        attachment
          .save()
          .then(() =>
            attachment.attach('file', attachment._filePath).then(() => attachment.save()),
          ),
      );
    },

    _printField(template, field, value) {
      const font = field.font || 'Arial';
      const size = field.fontSize || 38;

      template
        .font(font)
        .fontSize(size)
        .drawText(field.x, field.y, value);
    },

    async buildZip(_renderer) {
      const renderer = this;

      const zip = archiver.create('zip', {});
      const zipPath = path.join(OS.tmpdir(), `${uuid.v4()}.zip`);
      const writer = fs.createWriteStream(zipPath);

      zip.pipe(writer);

      const handleAttachment = async attachment => {
        let readStream;

        const url = attachment.file.url('original');

        if (LOCAL_URI_REGEXP.test(url)) {
          readStream = fs.createReadStream(path.join(process.cwd(), 'public', url));
        } else if (REMOTE_URI_REGEXP.test(url)) {
          readStream = request.get(url);
        }

        await zip.append(readStream, {
          name: `debt-collective-dispute/${attachment.file.meta('original').originalFileName}`,
        });
      };

      const [dispute] = await Dispute.query()
        .where('id', _renderer.disputeId)
        .include('attachments');

      await Promise.map(
        [..._renderer.attachments, ...dispute.attachments],
        handleAttachment,
        { concurrency: 1 }, // Why do we only allow one attachment at a time here?
      );

      await new Promise((resolve, reject) => {
        writer.on('close', err => {
          if (err) {
            return reject(err);
          }

          return resolve();
        });

        return zip.finalize();
      });

      await renderer.attach('zip', zipPath);
      const [id] = await renderer.save();
      return id;
    },
  },
});

module.exports = DisputeRenderer;
