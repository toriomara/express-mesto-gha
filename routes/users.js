const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getYourself,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const {
  validateUser,
  validateUserId,
  validateUserAvatar,
} = require('../utils/validation');

router.get('/', getUsers);
router.get('/me', getYourself);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUser, updateUser);
router.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
