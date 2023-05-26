// https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

const JWT_KEY = 'asaucerfulofsecrets';

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Авторизуйтесь, пожалуйста'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    next(new UnauthorizedError('Авторизуйтесь, пожалуйста'));
  }
  req.user = payload;
};

module.exports = { auth, JWT_KEY };

// const { isAuthorized } = require('../utils/jwt');

// module.exports = async (req, res, next) => {
//   const isAuth = await isAuthorized(req.headers.authorization);
//   if (!isAuth) return res.status(401).send({ message: 'Необходима авторизация' });
//   return next();
// };
