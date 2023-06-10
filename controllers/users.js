const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { MESSAGES, STATUS_CODES } = require('../utils/constants');
const {
  BadRequestError, NotFoundError, ConflictError,
} = require('../errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    }).then((user) => {
      res.status(STATUS_CODES.CREATED).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    }).catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(`${MESSAGES.BAD_REQUEST}. Такой пользователь уже зарегистрирован`));
      }
      return next(err);
    });
  }).catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    }).catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(MESSAGES.NOT_FOUND));
      }
      return res.send(user);
    })
    .catch(next);
};

const getYourself = async (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(MESSAGES.NOT_FOUND));
      }
      return res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  ).then((user) => {
    if (!user) {
      throw new NotFoundError(MESSAGES.NOT_FOUND);
    }
    res.send(user);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(`${MESSAGES.BAD_REQUEST} при обновлении профиля`));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  ).then((user) => {
    if (!user) {
      return next(new NotFoundError(MESSAGES.NOT_FOUND));
    }
    return res.send(user);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(MESSAGES.BAD_REQUEST));
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  getYourself,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
