const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const { pageNotFound } = require('./pageNotFound');

router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('*', pageNotFound);
module.exports = router;
