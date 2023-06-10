const router = require('express').Router();
const crashTestRouter = require('../utils/crashTest');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { MESSAGES } = require('../utils/constants');
const { NotFoundError } = require('../errors');
const { auth } = require('../middlewares/auth');
const {
  validateSignup,
  validateSignin,
} = require('../utils/validation');
const { createUser, login } = require('../controllers/users');

router.use('/', crashTestRouter);

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.use('/*', auth, (req, res, next) => next(new NotFoundError(MESSAGES.NOT_FOUND)));

module.exports = router;
