module.exports = class AuthenticationFailure extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationFailure';
  }
};
