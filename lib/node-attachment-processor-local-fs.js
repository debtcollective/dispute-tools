/* globals Class, S3Uploader */
const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');

const LocalFS = Class({}, 'LocalFS').inherits(S3Uploader)({
  prototype: {
    init(opts) {
      if (opts !== null && typeof opts === 'object') {
        if (opts.pathPrefix) {
          this._pathPrefix = opts.pathPrefix;
        } else {
          this._pathPrefix = '';
        }

        if (opts.bucket) {
          this._bucket = opts.bucket;
        } else {
          this._bucket = '';
        }

        if (opts.acceptedMimeTypes) {
          this._acceptedMimeTypes = opts.acceptedMimeTypes;
        } else {
          this._acceptedMimeTypes = [];
        }

        if (opts.maxFileSize) {
          this._maxFileSize = opts.maxFileSize;
        } else {
          this._maxFileSize = 0;
        }
      } else {
        this._pathPrefix = '';
        this._acceptedMimeTypes = [];
        this._maxFileSize = 0;
      }
    },

    deleteObjects() {
      throw new Error('Not implemented');
    },

    uploadStream(params) {
      const publicDir = path.join(process.cwd(), 'public', 'uploads');

      let finalPath = path.join(publicDir, this._pathPrefix, params.path);

      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
      }

      if (params.ext && !params.path.match(/\.\w+$/)) {
        finalPath = `${finalPath}.${params.ext}`;
      }

      return new Promise((resolve, reject) => {
        const wstream = fs.createWriteStream(finalPath);

        params.stream.pipe(wstream);

        wstream.on('end', () => {
          resolve({});
        });

        wstream.on('error', (err) => {
          reject(err);
        });
      });
    },
  },
});

module.exports = LocalFS;
