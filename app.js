const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000 } = process.env;
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';
const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '645e2b1f73f8b7f08d6d4880',
  };
  next();
});
app.use(express.json());
app.use(router);
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
