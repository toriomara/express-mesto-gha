const jwt = require('jsonwebtoken');

const JWT_KEY = 'asaucerfulofsecrets';

const getJwtToken = (id) => jwt.sign({ id }, JWT_KEY, { expiresIn: '7d' });

const isAuthorized = async (token) => {
  try {
    const data = await jwt.verify(token, JWT_KEY);
    return !!data;
  } catch (err) {
    return false;
  }
};

module.exports = { getJwtToken, isAuthorized };
