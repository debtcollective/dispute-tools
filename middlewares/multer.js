const multer = require('multer');

module.exports = multer().fields([
  {
    name: 'avatar',
    maxCount: 1,
  },
]);
