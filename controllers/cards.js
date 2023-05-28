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
  Card.create({ name, link, owner: req.user._id }).then((card) => {
    res.status(STATUS_CODES.OK).send(card);
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(`${MESSAGES.BAD_REQUEST} при создании карточки`));
    }
    return next(err);
  });
};

const deleteCardById = (req, res, next) => {
  // Card.findById(req.params.cardId)
  Card.findById(req.params)
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
      res.status(STATUS_CODES.OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError(`${MESSAGES.BAD_REQUEST} для постановки лайка`));
      }
      return next(err);
    })
    .catch(next);
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
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError(`${MESSAGES.BAD_REQUEST} для постановки лайка`));
      }
      return next(err);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
