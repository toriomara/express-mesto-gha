const Card = require('../models/card');
const {
  BadRequestError, NotFoundError, ForbiddebError,
} = require('../errors');
const { MESSAGES, STATUS_CODES } = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({}).then((cards) => res.statys(STATUS_CODES.OK).send(cards)).catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner }).then((card) => {
    res.status(STATUS_CODES.OK).send(card);
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`${MESSAGES.BAD_REQUEST} при создании карточки`));
    } else {
      next(err);
    }
  });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGES.NOT_FOUND);
      }
      if (!card.owner.equals(req.user._id)) {
        throw next(new ForbiddebError(MESSAGES.FORBIDDEN));
      }
      return card
        .deleteOne()
        .then(() => res.status(STATUS_CODES.OK).send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGES.NOT_FOUND);
      }
      res.status(STATUS_CODES.OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError(`${MESSAGES.BAD_REQUEST} для постановки лайка`));
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
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGES.NOT_FOUND);
      }
      res.send({ data: card });
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
