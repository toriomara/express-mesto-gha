const crashTestRouter = require('express').Router();

crashTestRouter.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

module.exports = crashTestRouter;
