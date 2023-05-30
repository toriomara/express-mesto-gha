// https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');
const JWT_KEY = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Авторизуйтесь, пожалуйста'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    return next(new UnauthorizedError('Авторизуйтесь, пожалуйста'));
  }
  req.user = payload;
  return next();
};
