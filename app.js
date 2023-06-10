require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('./middlewares/cors');
// const cors = require('cors');
// const { corsOptions } = require('./middlewares/cors');
const limiter = require('./utils/limiter');
const { errorMiddleware } = require('./middlewares/errorMiddleware');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const { DB_URL } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

// app.use(cors(corsOptions));
app.use(cors);
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorMiddleware);

const startApp = async () => {
  try {
    await mongoose.connect(DB_URL, {});
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err.message);
  }
};

startApp();
