const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000 } = process.env;
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';

const app = express();

app.use(express.json());
app.use(router);

app.use((req, res, next) => {
  req.user = {
    _id: '6454ebbdd44e1a56bf5a7e5d',
  };
  next();
});

app.use(express.urlencoded({ extended: true }));

const startApp = async () => {
  try {
    await mongoose.connect(DB_URL);
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startApp();
