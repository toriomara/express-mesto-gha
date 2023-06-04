// https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');
const JWT_KEY = require('../utils/constants');

const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = { auth, JWT_KEY };

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// const jwt = require('jsonwebtoken');
// const { UnauthorizedError } = require('../errors');
// const JWT_KEY = require('../utils/constants');

// const { STATUS_CODES, MESSAGES } = require('../utils/constants');

// const auth = (req, res, next) => {
//   const token = req.cookie.jwt;
//   if (!token) {
//     return res.status(STATUS_CODES.FORBIDDEN).send(MESSAGES.FORBIDDEN);
//   }

//   try {
//     const data = jwt.verify(token, JWT_KEY);
//     req.user = data._id;
//   } catch (err) {
//     return next(new UnauthorizedError('Пожалуйста, авторизуйтесь'));
//   }
//   return next();
// };

// module.exports = { auth, JWT_KEY };
