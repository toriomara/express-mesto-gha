const cardRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCard,
  validateCardId,
} = require('../utils/validation');

cardRouter.get('/', getCards);
cardRouter.post('/', validateCard, createCard);
cardRouter.put('/:cardId/likes', validateCardId, likeCard);
cardRouter.delete('/:cardId', validateCardId, deleteCardById);
cardRouter.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = cardRouter;
