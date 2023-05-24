const Card = require('../models/card');
const {
  BadRequestError, NotFoundError, UnauthorizedError,
} = require('../errors');
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
    const card = await Card.findById(cardId).populate('owner');
    if (!card) {
      throw new UnauthorizedError('Карточка с указанным _id не найдена');
    }
    const ownerId = card.owner.id;
    const userId = req.user._id;
    if (ownerId !== userId) {
      throw new UnauthorizedError('Невозможно удалить чужую карточку');
    }
    return res.send(card);
  } catch (err) {
    return next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail();
    if (!card) {
      throw new NotFoundError(MESSAGES.NOT_FOUND);
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new NotFoundError(`${MESSAGES.BAD_REQUEST} для постановки лайка`));
    }
    return next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail();
    if (!card) {
      throw new NotFoundError(MESSAGES.NOT_FOUND);
    }
    return res.send(card);
  } catch (err) {
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
