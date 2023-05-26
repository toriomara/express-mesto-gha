const router = require('express').Router();
const userRoutes = require('./users');
const cardsRoutes = require('./cards');
const { STATUS_CODES, MESSAGES } = require('../utils/constants');
const { auth } = require('../middlewares/auth');
const {
  validateSignup,
  validateSignin,
} = require('../utils/validation');

const { createUser, login } = require('../controllers/users');

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardsRoutes);
router.use('/*', (req, res) => res.status(STATUS_CODES.NOT_FOUND).send({ message: MESSAGES.NOT_FOUND }));

module.exports = router;
