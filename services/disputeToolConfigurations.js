const { RENDER_TYPE } = require('./renderers/DisputeTemplate');

/**
 * The following interfaces describe the configuration blocks for both the old
 * and new rendering pipelines. Mostly nothing has changed in their configurations
 * other than having added some properties to TemplateConfiguration that aim to
 * configure Pug and PDFKit templates
 */

/**
 * @typedef {(template: any, data: any) => void} TemplateFunction
 * @typedef {{ x: number, y: number }} TemplateFieldCoordinates
 */

/**
 * @typedef TemplateConfiguration
 *
 * @prop {string} type 'pug' and 'pdf' are supported
 * @prop {string} file absolute path to the template file
 * @prop {{ format: string, type: string }} pdf options to pass to the pdf generator
 * @prop {{ [fieldName: string]: TemplateFunction | TemplateFieldCoordinates }} fields
 *  functions to handle each field on a generated dispute
 */

/**
 * @typedef DocumentConfiguration
 *
 * @prop {TemplateConfiguration[]} templates
 */

/**
 * @typedef {{ [documentName: string]: DocumentConfiguration }} DocumentConfigurationMap
 *
 * A dispute tool option of 'none' indicates that the tool does not support any options
 * other than a single catch-all.
 * @typedef {{ [option: string]: DocumentConfigurationMap }} DisputeToolConfig
 *
 * @type {{ [disputeToolId: string]: DisputeToolConfig }}
 */

const _configurations = Object.assign(
  {},
  require('./renderers/tool-configurations/credit-report-dispute-letter'),
  require('./renderers/tool-configurations/general-dispute-letter'),
  require('./renderers/tool-configurations/private-student-loan-dispute-letter'),
  require('./renderers/tool-configurations/tax-return-dispute'),
  require('./renderers/tool-configurations/wage-garnishment-dispute'),
);

/**
 * Retrieves the configuration based on the dispute tool and the option.
 * @param {string} disputeToolId
 * @param {string?} option Defaults to `none`
 * @returns {DocumentConfigurationMap}
 */
const getConfiguration = (disputeToolId, option = 'none') => {
  return _configurations[disputeToolId][option];
};

module.exports = {
  _configurations,
  getConfiguration,
  RENDER_TYPE,
};
