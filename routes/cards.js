const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCardCreate,
  validateCardId,
} = require('../utils/validation');

router.delete('/:cardId/likes', validateCardId, dislikeCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId', validateCardId, deleteCardById);
router.get('/', getCards);
router.post('/', validateCardCreate, createCard);

module.exports = router;
