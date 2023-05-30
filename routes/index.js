const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { MESSAGES } = require('../utils/constants');
const { auth } = require('../middlewares/auth');
const {
  validateSignup,
  validateSignin,
} = require('../utils/validation');

const { createUser, login } = require('../controllers/users');
const { NotFoundError } = require('../errors');

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);

// router.use(auth);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.use('/*', (req, res, next) => next(new NotFoundError(MESSAGES.NOT_FOUND)));
// router.use();

module.exports = router;
