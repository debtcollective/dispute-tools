const { getConfiguration } = require('./disputeToolConfigurations');
const { mapValues, values } = require('lodash');
const getRenderer = require('./renderers');

const render = async ({ disputeToolId, data }) => {
  const documents = getConfiguration(disputeToolId, data.option);

  const files = await Promise.all(values(mapValues(documents, (document, name) =>
    Promise.all(document.templates.map(template =>
      getRenderer(template.type)(template, data, name)
    )))));

  return files;
};

module.exports = {
  render,
};
