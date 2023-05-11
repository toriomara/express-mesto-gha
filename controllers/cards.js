const Card = require('../models/card');
const { STATUS_CODES, MESSAGES } = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(STATUS_CODES['200_OK']).send(cards);
  } catch (err) {
    res
      .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
      .send(MESSAGES['500_INTERNAL_SERVER_ERROR']);
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
        .send(`{MESSAGES['400_BAD_REQUEST']} при создании карточки`);
    } else {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send(MESSAGES['500_INTERNAL_SERVER_ERROR']);
    }
  }
};

const deleteCardById = async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      res
        .status(STATUS_CODES['404_NOT_FOUND'])
        .send(`Карточка с указанным _id не найдена`);
    }
    res.status(STATUS_CODES['200_OK']).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(MESSAGES['400_BAD_REQUEST']);
    } else {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send(MESSAGES['500_INTERNAL_SERVER_ERROR']);
    }
  }
};

const likeCard = async (req, res) => {
  try {
    const cards = await Card.findByIdAndUpdate(
      req.params,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail();
    res.status(STATUS_CODES['200_OK']).send(cards);
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      res
        .status(STATUS_CODES['404_NOT_FOUND'])
        .send(`Передан несуществующий _id карточки`);
    } else if (err.name === 'CastError') {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(`{MESSAGES['400_BAD_REQUEST']} для постановки лайка`);
    } else {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send(MESSAGES['500_INTERNAL_SERVER_ERROR']);
    }
  }
};

const dislikeCard = async (req, res) => {
  try {
    const cards = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail();
    res.status(STATUS_CODES['200_OK']).send(cards);
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      res
        .status(STATUS_CODES['404_NOT_FOUND'])
        .send(`Передан несуществующий _id карточки`);
    } else if (err.name === 'CastError') {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(`{MESSAGES['400_BAD_REQUEST']} для постановки лайка`);
    } else {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send(MESSAGES['500_INTERNAL_SERVER_ERROR']);
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
