const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

module.exports = multer({ storage: storage }).fields([
  {
    name: 'image',
    maxCount: 1,
  },
]);
