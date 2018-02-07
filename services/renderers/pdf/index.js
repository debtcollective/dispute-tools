const fillPdf = require('fill-pdf');
const { writeFile } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');
const uuid = require('uuid');
const PDFDocument = require('hummus-recipe');

module.exports = ({ file, normalize = l => l, post }, data, documentName) =>
  new Promise((resolve, reject) => {
    fillPdf.generatePdf(normalize(data), file(data), (err, buffer) => {
      if (err) {
        return reject(err);
      }

      const rendered = join(tmpdir(), `${documentName}_${uuid.v4()}.pdf`);

      return writeFile(rendered, buffer, writeErr => {
        if (writeErr) {
          return reject(writeErr);
        }

        if (post !== null) {
          const pdf = new PDFDocument(rendered, rendered);

          post.forEach(fn => fn(pdf, data));
          pdf.endPDF();
        }

        return resolve({ rendered });
      });
    });
  });
