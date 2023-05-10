const Card = require('../models/card');
const { STATUS_CODES, MESSAGES } = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(STATUS_CODES['200_OK']).send(cards);
  } catch (err) {
    res
      .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
      .send({ message: err.message });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(STATUS_CODES['200_OK']).send(card);
  } catch (err) {
    if ((err.name = 'ValidationError')) {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(MESSAGES['400_BAD_REQUEST']);
    } else {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send({ message: err.message });
    }
  }
};

const deleteCardById = async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      res.status(STATUS_CODES['404_NOT_FOUND']).send(MESSAGES['404_NOT_FOUND']);
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(MESSAGES['400_BAD_REQUEST']);
    } else {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send({ message: err.message });
    }
  }
};

const likeCard = async (req, res) => {
  try {
    const cards = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).onFail();
    res.status(STATUS_CODES['200_OK']).send(cards);
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      res.status(STATUS_CODES['404_NOT_FOUND']).send(MESSAGES['404_NOT_FOUND']);
    } else if (err.name === 'CastError') {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(MESSAGES['400_BAD_REQUEST']);
    } else {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send({ message: err.message });
    }
  }
};

const dislikeCard = async (req, res) => {
  try {
    const cards = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).onFail();
    res.status(STATUS_CODES['200_OK']).send(cards);
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      res.status(STATUS_CODES['404_NOT_FOUND']).send(MESSAGES['404_NOT_FOUND']);
    } else if (err.name === 'CastError') {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(MESSAGES['400_BAD_REQUEST']);
    } else {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send({ message: err.message });
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
