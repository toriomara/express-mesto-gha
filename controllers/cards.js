const Card = require('../models/card');
const BadRequestError = require('../errors');
const NotFoundError = require('../errors');
// const ConflictError = require('../errors');
const { MESSAGES } = require('../utils/constants');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(`${MESSAGES.BAD_REQUEST} при создании карточки`));
    }
    return next(err);
  }
};

const deleteCardById = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      return next(new NotFoundError('Карточка с указанным _id не найдена'));
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(MESSAGES.BAD_REQUEST));
    }
    return next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const cards = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail();
    return res.send(cards);
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Передан несуществующий _id карточки'));
    }
    if (err.name === 'CastError') {
      return next(new NotFoundError(`${MESSAGES.BAD_REQUEST} для постановки лайка`));
    }
    return next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const cards = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail();
    return res.send(cards);
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Передан несуществующий _id карточки'));
    }
    if (err.name === 'CastError') {
      return next(new NotFoundError(`${MESSAGES.BAD_REQUEST} для снятия лайка`));
    }
    return next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
