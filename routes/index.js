const router = require('express').Router();
const userRoutes = require('./users');
const cardsRoutes = require('./cards');
const { STATUS_CODES, MESSAGES } = require('../utils/constants');
const auth = require('../middlewares/auth');

// const { createUser, login } = require('../controllers/users');
const authRoutes = require('./auth');

router.use('/signup', authRoutes);
router.use('/signin', authRoutes);

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardsRoutes);
router.use('/*', (req, res) => res.status(STATUS_CODES.NOT_FOUND).send({ message: MESSAGES.NOT_FOUND }));

module.exports = router;
