const userRouter = require('express').Router();
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

userRouter.get('/', getUsers);
userRouter.get('/me', getYourself);
userRouter.get('/:userId', validateUserId, getUserById);
userRouter.patch('/me', validateUser, updateUser);
userRouter.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = userRouter;
