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
  validateUserUpdate,
  validateUserAvatar,
} = require('../utils/validation');

router.patch('/me/avatar', validateUserAvatar, updateAvatar);
router.get('/me', getYourself);
router.patch('/me', validateUserUpdate, updateUser);
router.get('/:userId', validateUser, getUserById);
router.get('/', getUsers);

module.exports = router;
