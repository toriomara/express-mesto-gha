const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Пожалуйста, авторизуйтесь'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Пожалуйста, авторизуйтесь'));
  }
  req.user = payload;
  return next();
};

module.exports = { auth, JWT_SECRET };
