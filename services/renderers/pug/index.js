const pug = require('pug');
const htmlPdf = require('html-pdf');
const path = require('path');
const { tmpdir } = require('os');
const uuid = require('uuid');
const { withUtils } = require('./utils');

const getFilename = documentName => path.join(tmpdir(), `${documentName}-${uuid.v4()}.pdf`);

module.exports = ({ file, pdf, normalize = l => l }, locals, documentName) =>
  new Promise((resolve, reject) => {
    pug.renderFile(file(locals), withUtils(normalize(locals)), (htmlErr, html) => {
      if (htmlErr) {
        return reject(htmlErr);
      }

      return htmlPdf.create(html, pdf).toFile(getFilename(documentName), (pdfErr, rendered) => {
        if (pdfErr) {
          return reject(pdfErr);
        }

        return resolve({
          rendered: rendered.filename,
          documentName,
        });
      });
    });
  });
