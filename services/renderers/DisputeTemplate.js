const { join } = require('path');
const { values, mapValues } = require('lodash');

/**
 * @typedef DisputeTemplateConfiguration
 *
 * @prop {'pug'|'pdf'} type One of 'pug' or 'pdf'
 * @prop {string[]|(data: any) => string[]} file Path split into array to be passed to path.join
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
     * One of 'pug' or 'pdf'
     */
    type,
    /**
     * Either a path split into array to be passed to path.join or a function
     * taking arguments used to determine which file is used. Useful for when
     * the determination of the tile to use depends on an answer to one of the
     * form questions
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
    /**
     * Predicate accepting the dispute data and returning true if the document should be included
     * in the dispute render and false if it should be skipped.
     */
    iff = () => true,
  }) {
    this.type = type;

    this.file =
      typeof file === 'function'
        ? (...args) => join(DisputeTemplate.templatesRoot, ...file(...args))
        : () => join(DisputeTemplate.templatesRoot, ...file);

    this.pdf = pdf;
    this.normalize = normalize.bind(this);
    if (post === null) {
      this.post = null;
    } else {
      this.post = (Array.isArray(post) ? post : [post]).map(fn => fn.bind(this));
    }
    this.data = data;
    this.iff = iff;
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
  PDF: 'pdf',
};

DisputeTemplate.templatesRoot = join(process.cwd(), 'lib', 'assets', 'document_templates');

module.exports = DisputeTemplate;
