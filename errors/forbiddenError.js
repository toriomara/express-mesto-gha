module.exports = class ForbiddebError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
};
