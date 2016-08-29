const metadata = require('im-metadata');
const imageMagick = require('imagemagick-stream');

const getMetadata = function getMetadata(file) {
  return new Promise((resolve, reject) => {
    metadata(file.path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        file.meta = file.meta = {};
        file.meta.size = data.size;
        file.meta.width = data.width;
        file.meta.height = data.height;
        file.extension = data.format.toLowerCase();

        resolve(file);
      }
    });
  });
};

const resizeImage = function resizeImage(params) {
  return (file) => {
    const resize = imageMagick()
      .resize(`${params.maxWidth}x${params.maxHeight}`)
      .quality(params.quality || 90);

    return file.pipe(resize);
  };
};

module.exports = {
  process(file, params) {
    return getMetadata(file)
      .then(resizeImage(params));
  },
};
