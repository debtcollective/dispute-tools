const renderers = {
  pug: require('./pug'),
  pdf: require('./pdf'),
};

module.exports = renderType => renderers[renderType];
