const jwt = require('jsonwebtoken');

const JWT_KEY = 'asaucerfulofsecrets';

const getJwtToken = (id) => jwt.sign({ id }, JWT_KEY, { expiresIn: '7d' });

const isAuthorized = async (req, res, token) => {
  try {
    // const data = await jwt.verify(token, JWT_KEY);
    const data = jwt.verify(token, JWT_KEY);
    // return !!data;
    if (data) {
      return res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
    } return res.send({ message: 'Hello World!' });
  } catch (err) {
    return false;
  }
};

module.exports = { getJwtToken, isAuthorized };
