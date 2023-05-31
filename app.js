const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
// const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { errorMiddleware } = require('./middlewares/errorMiddleware');
const routes = require('./routes');
const { DB_URL } = require('./utils/constants');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const { PORT = 3000 } = process.env;
const app = express();

app.use(limiter);
app.use(helmet());
app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(errors());
app.use(errorMiddleware);

// const startApp = (database, port) => {
//   mongoose.connect(database);
//   app.listen(port).then(() => {
//     console.log(`App listening on port ${port}`);
//   }).catch((err) => {
//     console.log(err.message);
//   });
// };

mongoose.connect(DB_URL);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// const startApp = (database, port) => {
//   mongoose.connect(database);
//   app.listen(port).then(() => {
//     console.log(`App listening on port ${port}`);
//   }).catch((err) => {
//     console.log(err.message);
//   });
// };

// const startApp = async () => {
//   try {
//     await mongoose.connect(DB_URL);
//     app.listen(PORT, () => {
//       console.log(`App listening on port ${PORT}`);
//     });
//   } catch (err) {
//     console.log(err.message);
//   }
// };

// startApp(DB_URL, PORT);
