const Card = require('../models/card');
const { STATUS_CODES, MESSAGES } = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: `${MESSAGES.BAD_REQUEST} при создании карточки` });
    }
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const deleteCardById = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: MESSAGES.BAD_REQUEST });
    }
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const likeCard = async (req, res) => {
  try {
    const cards = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail();
    return res.send(cards);
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .send({ message: 'Передан несуществующий _id карточки' });
    }
    if (err.name === 'CastError') {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: `${MESSAGES.BAD_REQUEST} для постановки лайка` });
    }
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const cards = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail();
    return res.send(cards);
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .send({ message: 'Передан несуществующий _id карточки' });
    }
    if (err.name === 'CastError') {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: `${MESSAGES.BAD_REQUEST} для снятия лайка` });
    }
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
