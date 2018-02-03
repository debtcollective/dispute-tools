module.exports = class EmailSendingFailureError extends Error {
  constructor(causedBy) {
    super();
    this.causedBy = causedBy;
  }
};
