const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');

// router.use(useRouter, cardsRouter);
router.use(userRouter);
router.use(cardsRouter);
module.exports = router;
