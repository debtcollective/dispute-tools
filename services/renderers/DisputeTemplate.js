const { join } = require('path');
const { values, mapValues } = require('lodash');

/**
 * @typedef DisputeTemplateConfiguration
 *
 * @prop {'pug'|'pdf'|'legacy'} type One of 'pug', 'pdf', or 'legacy'
 * @prop {string[]} file Path split into array to be passed to path.join
 * @prop {any?} pdf PDF rendering settings passed to html-pdf
 * @prop {(({ forms: { 'personal-information-form': any } }) => any)?} normalize
 *    Function to normalize the form data to make the templates easier to read. Gets bound to
 *    the template so that it has access to the whole configuration block
 * @prop {any} data Miscellaneous configuration data usable in the normalize and post functions
 * @prop {((pdf: PDFDocument, data: any) => void)[]?} post A single function or array of functions
 *    to be run after form has been filled out. Useful for adding things like signatures, notes
 *    or other miscellaneous information that is not included in the generated fdf of the pdf.
 *    Currently only supported by the `pdf` rendering pipeline
 */
class DisputeTemplate {
  constructor({
    /**
     * One of 'pug', 'pdf', or 'legacy'
     */
    type = DisputeTemplate.RENDER_TYPE.LEGACY,
    /**
     * Path split into array to be passed to path.join
     */
    file,
    /**
     * PDF rendering settings passed to html-pdf
     */
    pdf = DisputeTemplate.DEFAULT_PDF_CONFIG,
    /**
     * Function to normalize the form data to make the templates easier to read. Gets bound to
     * the template so that it has access to the whole configuration block.
     */
    normalize = ({ forms: { 'personal-information-form': form } }) => form,
    /**
     * Miscellaneous configuration data usable in the normalize and post functions
     */
    data = {},
    /**
     * A single function or array of functions to be run after form has been filled out.
     * Useful for adding things like signatures, notes or other miscellaneous information
     * that is not included in the generated fdf of the pdf. Currently only supported
     * by the `pdf` rendering pipeline
     */
    post = null,
  }) {
    this.type = type;

    this.file = join(DisputeTemplate.templatesRoot, ...file);

    this.pdf = pdf;
    this.normalize = normalize.bind(this);
    if (post === null) {
      this.post = null;
    } else {
      this.post = (Array.isArray(post) ? post : [post]).map(fn => fn.bind(this));
    }
    this.data = data;
  }

  execDataFunctions(form) {
    return values(mapValues(this.data, fn => fn(form)));
  }
}

DisputeTemplate.DEFAULT_PDF_CONFIG = {
  format: 'Legal',
  type: 'pdf',
  border: '1in',
};

DisputeTemplate.PDF_WRITER_CONFIG = {
  fontSize: 12,
  color: '000000',
  textBox: {
    lineHeight: 14,
    width: 450,
  },
};

DisputeTemplate.RENDER_TYPE = {
  PUG: 'pug',
  LEGACY: 'legacy',
  PDF: 'pdf',
};

DisputeTemplate.templatesRoot = join(process.cwd(), 'lib', 'assets', 'document_templates');

module.exports = DisputeTemplate;
