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
        // reduce behaves different when using an async callback
        // https://gyandeeps.com/array-reduce-async-await/
        document.templates.reduce(async (previousPromise, template) => {
          const renders = await previousPromise;
          const shouldRender = template.iff(data);

          if (shouldRender) {
            // using await to execute getRenderer synchronously
            // running phantom.js in parallel causes problems when the system is under load
            // related to https://github.com/marcbachmann/node-html-pdf/issues/386
            const renderedDoc = await getRenderer(template.type)(template, data, name);

            renders.push(renderedDoc);
          }

          return renders;
        }, Promise.resolve([])),
      ),
    ),
  );

  return files;
};

module.exports = {
  render,
};
