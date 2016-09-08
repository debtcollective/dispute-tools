const multer = require('multer');
const uuid = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${uuid.v4()}`);
  },
});

module.exports = multer({ storage }).fields([
  {
    name: 'image',
    maxCount: 1,
  },
  {
    name: 'attachment',
  },
]);
