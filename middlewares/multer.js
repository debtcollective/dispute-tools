const multer = require('multer');

module.exports = multer().fields([
  {
    name: 'image',
    maxCount: 1,
  },
]);
