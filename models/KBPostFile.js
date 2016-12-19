/* globals Class, Attachment, Krypton */

const KBPostFile = Class('KBPostFile').inherits(Attachment)({
    attachmentStorage: new Krypton.AttachmentStorage.Local({
      acceptedMimeTypes: [/image/, /application/],
      maxFileSize: 10485760, // 10MB
    }),

  prototype: {
    init(config) {
      Krypton.Model.prototype.init.call(this, config);

      this.type = 'KBPostFile';

      this.fileMeta = this.fileMeta || {};

      this.hasAttachment({
        name: 'file',
      });
    },
  }
});

module.exports = KBPostFile;
