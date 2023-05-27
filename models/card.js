const mongoose = require('mongoose');
const validator = require('validator');
// const isUrl = require('validator/lib/isURL');

// const cardSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     minlength: 2,
//     maxlength: 30,
//     required: true,
//   },
//   link: {
//     type: String,
//     required: true,
//     validate: {
//       validator: (url) => validator.isUrl(url),
//       // validator: isUrl,
//       message: 'Введите корректную ссылку',
//     },
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'user',
//     required: true,
//   },
//   likes: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'user',
//     default: [],
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

function validateUrl(url) {
  const regex = /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i;
  if (regex.test(url)) {
    return url;
  }
  throw new Error('Введен некорректный url');
}

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    link: {
      type: String,
      required: true,
      validate: { validator: validateUrl, message: 'Введите корректный URL' },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
      ],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
