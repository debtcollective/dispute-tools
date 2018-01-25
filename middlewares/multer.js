const multer = require('multer');
const uuid = require('uuid');
const fs = require('fs-extra');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = `/tmp/${uuid.v4()}/`;
    fs.mkdirs(dir, err => cb(err, dir));
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

module.exports = multer({ storage }).fields([
  {
    name: 'image',
    maxCount: 1,
  },
  {
    name: 'resource',
  },
  {
    name: 'attachment',
  },
]);
