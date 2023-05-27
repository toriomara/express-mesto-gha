const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { MESSAGES, REGEX_URL } = require('../utils/constants');
const { UnauthorizedError } = require('../errors');

function validateUrl(url) {
  const regex = /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i;
  if (regex.test(url)) {
    return url;
  }
  throw new Error('Введен некорректный url');
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: { validator: validateUrl, message: 'Введите корректный URL' },
    },
  },
  {
    versionKey: false,
  },
);

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     minlength: 2,
//     maxlength: 30,
//     default: 'Жак-Ив Кусто',
//   },
//   about: {
//     type: String,
//     minlength: 2,
//     maxlength: 30,
//     default: 'Исследователь',
//   },
//   avatar: {
//     type: String,
//     default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
//     validate: {
//       // validator: (url) => REGEX_URL.test(url),
//       validator: (url) => validator.isUrl(url),
//       message: 'Введите корректный email',
//     },
//   },
//   email: {
//     type: String,
//     unique: true,
//     required: [true, 'Заполните поле email'],
//     // required: true,
//     // validate: {
//     //   validator: validator.isEmail,
//     //   message: 'Введите корректный email',
//     // },
//     validate: {
//       validator: (email) => validator.isEmail(email),
//       message: 'Введите корректный email',
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//     select: false,
//   },
// });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError(MESSAGES.UNAUTHORIZED),
        );
      }
      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          return Promise.reject(
            new UnauthorizedError(MESSAGES.UNAUTHORIZED),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
