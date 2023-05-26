const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { MESSAGES, REGEX_URL } = require('../utils/constants');
const { UnauthorizedError } = require('../errors');

const userSchema = new mongoose.Schema({
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
    validate: {
      validator: (url) => REGEX_URL.check(url),
      message: 'Введите корректный email',
    },
  },
  email: {
    type: String,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введите корректный email',
    },
    unique: true,
    required: [true, 'Заполните поле email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError(MESSAGES.UNAUTHORIZED),
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError(MESSAGES.UNAUTHORIZED),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
