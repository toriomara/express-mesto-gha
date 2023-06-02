// https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');
const JWT_KEY = require('../utils/constants');

const auth = async (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = await jwt.verify(token, JWT_KEY);
    req.user = payload;
  } catch (err) {
    return next(new UnauthorizedError('Авторизуйтесь, пожалуйста'));
  }
  return next();
};

module.exports = { auth, JWT_KEY };
