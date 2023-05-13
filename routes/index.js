const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const unpathRouter = require('./unpath');

router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('/*', unpathRouter);
module.exports = router;
