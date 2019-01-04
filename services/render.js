const { getConfiguration } = require('./disputeToolConfigurations');
const { mapValues, values } = require('lodash');
const getRenderer = require('./renderers');

const render = async dispute => {
  const { disputeToolId, data } = dispute;
  const documents = getConfiguration(disputeToolId, data.option);

  // Add dates
  data.createdAt = dispute.createdAt;
  data.updatedAt = dispute.updatedAt;

  const files = await Promise.all(
    values(
      mapValues(documents, (document, name) =>
        Promise.all(
          document.templates.reduce(
            // eslint-disable-next-line no-confusing-arrow
            (renders, template) =>
              template.iff(data)
                ? [...renders, getRenderer(template.type)(template, data, name)]
                : renders,
            [],
          ),
        ),
      ),
    ),
  );

  return files;
};

module.exports = {
  render,
};
