const fillPdf = require('fill-pdf');
const fs = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');
const uuid = require('uuid');
const PDFDocument = require('hummus-recipe');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const generatePdf = (data, file) =>
  new Promise((resolve, reject) =>
    fillPdf.generatePdf(data, file, (err, buffer) => (err ? reject(err) : resolve(buffer))),
  );

module.exports = async ({ file, normalize = l => l, post }, data, documentName) => {
  const normalized = normalize(data);
  const buffer = await (normalized === null
    ? readFile(file(data))
    : generatePdf(normalized, file(data)));
  const rendered = join(tmpdir(), `${documentName}_${uuid.v4()}.pdf`);
  await writeFile(rendered, buffer);

  if (post !== null) {
    const pdf = new PDFDocument(rendered, rendered);

    post.forEach(fn => fn(pdf, data));
    pdf.endPDF();
  }

  return { rendered };
};
