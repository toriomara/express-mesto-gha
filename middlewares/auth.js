// https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');
const JWT_KEY = require('../utils/constants');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_KEY);
    req.user = payload;
  } catch (err) {
    return next(new UnauthorizedError('Авторизуйтесь, пожалуйста'));
  }
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
//     return next(new UnauthorizedError('Авторизуйтесь, пожалуйста'));
//   }
//   return next();
// };

// module.exports = { auth, JWT_KEY };
