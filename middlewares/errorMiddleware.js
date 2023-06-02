const { MESSAGES } = require('../utils/constants');

module.exports.errorMiddleware = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? MESSAGES.INTERNAL_SERVER_ERROR : message,
  });
  next();
};
