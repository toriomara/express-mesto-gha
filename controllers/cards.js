const Card = require('../models/card');
const {
  BadRequestError, NotFoundError, ForbiddenError,
} = require('../errors');
const { MESSAGES, STATUS_CODES } = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards.reverse()))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(STATUS_CODES.CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`${MESSAGES.BAD_REQUEST} при создании карточки`));
      }
      return next(err);
    });
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(new NotFoundError(MESSAGES.NOT_FOUND))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError(MESSAGES.FORBIDDEN));
      }
      return card
        .deleteOne({ _id: card._id })
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return next(new NotFoundError(MESSAGES.NOT_FOUND));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(`${MESSAGES.BAD_REQUEST} для постановки лайка`));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return next(new NotFoundError(MESSAGES.NOT_FOUND));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError(`${MESSAGES.BAD_REQUEST} для постановки лайка`));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
