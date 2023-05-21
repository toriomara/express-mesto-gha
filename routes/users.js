const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const {
  validateUser,
  validateUserUpdate,
  validateUserAvatar,
} = require('../utils/validation');

router.get('/', getUsers);
router.get('/:userId', validateUser, getUserById);
router.patch('/me', validateUserUpdate, updateUser);
router.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
