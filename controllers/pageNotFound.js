const { STATUS_CODES, MESSAGES } = require('../utils/constants');

const pageNotFound = async (req, res) => {
  try {
    res.status(STATUS_CODES.NOT_FOUND).send(MESSAGES.NOT_FOUND);
  } catch (err) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = { pageNotFound };
