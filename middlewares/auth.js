// https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');
const JWT_KEY = require('../utils/constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log(1);
    return next(new UnauthorizedError('Пожалуйста, авторизуйтесь'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_KEY);
    console.log(2);
  } catch (err) {
    console.log('error');
    return next(new UnauthorizedError('Пожалуйста, авторизуйтесь'));
  }

  req.user = payload;

  return next();
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
