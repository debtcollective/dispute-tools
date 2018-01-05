const renderers = {
  pug: require('./pug'),
  legacy: require('./legacy'),
  pdf: require('./pdf'),
};

/**
 * Fallback to 'legacy' so we don't have to add the template type
 * to all the old renderers
 */
module.exports = (renderType = 'legacy') => renderers[renderType];
