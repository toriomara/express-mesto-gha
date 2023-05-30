const router = require('express').Router();
const userRoutes = require('./users');
const cardsRoutes = require('./cards');
const { MESSAGES } = require('../utils/constants');
const { auth } = require('../middlewares/auth');
const {
  validateSignup,
  validateSignin,
} = require('../utils/validation');

router.use(auth);
const { createUser, login } = require('../controllers/users');
const { NotFoundError } = require('../errors');

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);
router.use('/users', userRoutes);
router.use('/cards', cardsRoutes);
router.use('/*', (req, res, next) => next(new NotFoundError(MESSAGES.NOT_FOUND)));

module.exports = router;
