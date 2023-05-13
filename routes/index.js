const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const { STATUS_CODES, MESSAGES } = require('../utils/constants');

router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res) => res.status(STATUS_CODES.NOT_FOUND).send({ message: MESSAGES.NOT_FOUND }));

module.exports = router;
