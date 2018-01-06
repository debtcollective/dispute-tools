const { join } = require('path');
const { tmpdir } = require('os');
const uuid = require('uuid');
const { mapValues, isFunction, get } = require('lodash');
const gm = require('gm').subClass({
  imageMagick: process.env.GM === 'true' || false,
});

const printField = (template, { x, y, font = 'Arial', fontSize = 38 }, value) => {
  template
    .font(font)
    .fontSize(fontSize)
    .drawText(x, y, value);
};

const render = (
  { path: file, fields },
  data,
  documentName
) => {
  const templateFile = gm(join(process.cwd(), file));

  mapValues(fields, (field, fieldName) => {
    if (isFunction(field)) {
      field(templateFile, data);
    } else {
      const fieldValue = get(data.forms, fieldName);
      if (fieldValue !== undefined) {
        printField(templateFile, field, fieldValue);
      }
    }
  });

  const convert = gm();

  return new Promise((resolve, reject) => {
    const templatePath = join(tmpdir(), `${uuid.v4()}.png`);
    convert.in(templatePath);
    templateFile.write(templatePath, writeErr => {
      if (writeErr) {
        return reject(writeErr);
      }

      const pdfPath = `${templatePath}.pdf`;

      return convert.density('300', '300').write(pdfPath, pdfErr => {
        if (pdfErr) {
          return reject(pdfErr);
        }

        return resolve({
          rendered: pdfPath,
          documentName,
        });
      });
    });
  });
};

module.exports = render;
