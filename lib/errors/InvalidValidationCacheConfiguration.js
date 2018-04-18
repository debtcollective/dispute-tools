module.exports = class InvalidValidationCacheConfiguration extends Error {
  constructor(slug, option) {
    super(`Unable to find validation configuration for ${slug} and the option ${option}`);
  }
};
