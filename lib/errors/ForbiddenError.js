module.exports = class ForbiddenError extends Error {
  constructor() {
    super();
    this.name = 'ForbiddenError';
  }
};
