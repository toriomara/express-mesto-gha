const router = require('express').Router();
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

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId', validateCard, deleteCardById);
router.delete('/:cardId/likes', validateCard, dislikeCard);

module.exports = router;
