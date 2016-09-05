/* global Krypton, Class, CONFIG, AWS, S3Uploader */
const gm = require('gm').subClass({ imageMagick: true });

const DisputeAttachment = Class('DisputeAttachment').inherits(Krypton.Model)
  .includes(Krypton.Attachment)({
    tableName: 'DisputeAttachments',
    validations: {
      disputeId: ['required'],
    },
    attributes: ['id', 'disputeId', 'filePath', 'fileMeta', 'createdAt', 'updatedAt'],
    attachmentStorage: new Krypton.AttachmentStorage.Local({
      acceptedMimeTypes : [/image/, 'application/pdf'],
      maxFileSize: 10485760, // 10MB
    }),

    prototype: {
      init(config) {
        Krypton.Model.prototype.init.call(this, config);

        this.hasAttachment({
          name: 'file',
          versions: {
            thumb(readStream) {
              return gm(readStream)
                .resize(40, 40)
                .stream();
            },
          },
        });

        return this;
      },
    },
  });

module.exports = DisputeAttachment;
