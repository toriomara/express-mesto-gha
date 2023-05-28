const Card = require('../models/card');
const {
  BadRequestError, NotFoundError,
} = require('../errors');
const { MESSAGES } = require('../utils/constants');
const ForbiddebError = require('../errors/forbiddenError');

// Не переписывал на then
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
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGES.NOT_FOUND);
      }
      if (req.user._id !== card.owner.toString()) {
        throw new ForbiddebError(MESSAGES.FORBIDDEN);
      }
      card
        .deleteOne()
        .then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(
          new BadRequestError(`${MESSAGES.BAD_REQUEST} о карточке`),
        );
      }
      return next(error);
    });
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
