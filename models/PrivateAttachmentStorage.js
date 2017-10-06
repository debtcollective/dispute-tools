/* globals Krypton, Class, Module */

const magic = require('stream-mmmagic');
const request = require('request');
const imagesize = require('imagesize');

const mime = require('mime');

const Promise = require('bluebird');

const PrivateAttachmentStorage =
  Class({}, 'PrivateAttachmentStorage')
    .inherits(Krypton.AttachmentStorage.Abstract)({
      prototype: {
        bucketName: null,
        bucketInstance: null,
        getURL(pathField, version, ext) {
          const key = `${pathField}`
            .replace(/{version}/g, version)
            .replace(/{ext}/g, ext);
          return this.getSignedURL(key);
        },

        getSignedURL(objectKey, expiresIn = 20) {
          return this.bucketInstance.getSignedUrl('getObject', {
            Key: objectKey,
            Expires: expiresIn,
          });
        },

        saveStream(stream, basePath) {
          const storage = this;
          const version = Object.keys(stream)[0];

          return new Promise((resolve, reject) => {
            magic(stream[version], (err, _mime, output) => {
              if (err) {
                reject(err);
              }

              const ext = mime.getExtension(_mime.type);

              const filePath = basePath
                .replace(/{version}/g, version)
                .replace(/{ext}/g, ext);

              storage.bucketInstance.upload({
                Body: output,
                Key: filePath,
                ContentType: _mime.type,
                ACL: 'private',
              })
                .send((error, awsData) => {
                  if (error) {
                    return reject(error);
                  }

                  if (/image/.test(_mime.type)) {
                    const signedUrl = this.getSignedURL(awsData.Key);
                    return imagesize(request.get(signedUrl), (_err, info) => {
                      if (_err) {
                        return reject(_err);
                      }

                      const response = {};

                      response[version] = {
                        ext,
                        mimeType: _mime.type,
                        width: info.width,
                        height: info.height,
                        key: awsData.Key,
                      };

                      return resolve(response);
                    });
                  }

                  const response = {};

                  response[version] = {
                    ext,
                    mimeType: _mime.type,
                  };

                  return resolve(response);
                });
            });
          });
        },
      },
    });

module.exports = PrivateAttachmentStorage;
