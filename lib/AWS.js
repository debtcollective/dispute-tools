const { aws: { bucket, secrets } } = require('../config/config').env();
const AWS = require('aws-sdk');

AWS.config.update(secrets);

const bucketInstance = exports.bucketInstance = new AWS.S3({
  params: {
    Bucket: bucket,
    // We keep the default ACL as private so that we can use the same bucket,
    // then below intercept calls to `upload` and overwrite the default ACL
    // property with `public-read`
    ACL: 'public-read',
  },
});

const basePath = exports.basePath = `https://${bucket}.s3.amazonaws.com/`;

exports.buildFullPaths = file => {
  const urls = {};
  Object.keys(file.versions).forEach(version => {
    if (file.exists(version)) {
      urls[version] = basePath + file.url(version);
    }
  });
  return urls;
};

const defaultConfig = exports.defaultConfig = {
  // This must be set to an empty string to prevent Krypton's default attachment
  // storage implementation from adding `null` or `undefined` at the front
  // of the first sub-folder in the bucket. This will make our bucket keys go
  // like: <BUCKET_NAME>/<ENV>/<OBJECT_NAME>/<PK_ID>/<VERSION>.<EXT>
  pathPrefix: '',
  bucket,
  bucketInstance,
};

/**
 * Creates the default Krypton S3 config object, allowing multiple
 * objects to be passed in should the defaults need to be overwritten
 *  (Though that seems unlikely...)
 *
 * Notice that the defaultConfig is NOT assigned to.
 * This function always returns a new object
 */
exports.assignDefaultConfig = (...args) => Object.assign({}, defaultConfig, ...args);

exports.getSignedURL = (objectKey, expiresIn = 20) =>
  bucketInstance.getSignedUrl('getObject', {
    Key: objectKey,
    Expires: expiresIn,
  });
