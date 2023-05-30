const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { MESSAGES, STATUS_CODES } = require('../utils/constants');
// const {
//   BadRequestError, NotFoundError, ConflictError, UnauthorizedError,
// } = require('../errors');
const { BadRequestError } = require('../errors/badRequestError');
const { NotFoundError } = require('../errors/notFoundError');
const { ConflictError } = require('../errors/conflictError');
const { UnauthorizedError } = require('../errors/unathorizedError');
const { JWT_KEY } = require('../utils/constants');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    }).then(() => {
      res.status(STATUS_CODES.OK).send({
        data: {
          name, about, avatar, email,
        },
      });
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`${MESSAGES.BAD_REQUEST} при создании пользователя`));
      } if (err.code === 11000) {
        next(new ConflictError(`${MESSAGES.BAD_REQUEST}. Такой пользователь уже зарегистрирован`));
      }
      return next(err);
    });
  }).catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError(MESSAGES.UNAUTHORIZED));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError(MESSAGES.UNAUTHORIZED));
          }
          const token = jwt.sign(
            { _id: user._id },
            JWT_KEY,
            { expiresIn: '7d' },
          );
          return res.send({ token });
        });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_CODES.OK).send(users);
    }).catch(next);
};

const getUserById = (req, res, next) => {
  // User.findById(req.params.userId)
  User.findById(req.params)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MESSAGES.NOT_FOUND);
      }
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(MESSAGES.BAD_REQUEST));
      }
      return next(err);
    });
};

const getYourself = async (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MESSAGES.NOT_FOUND);
      }
      res.status(STATUS_CODES.OK)
        .send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(BadRequestError(MESSAGES.BAD_REQUEST));
      } else if (err.message === 'Не найдено') {
        next(new NotFoundError(MESSAGES.NOT_FOUND));
      } else {
        next(err);
      }
    });
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
    res.status(STATUS_CODES.OK).send(user);
  })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError(`${MESSAGES.BAD_REQUEST} при обновлении профиля`));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => { /// Доработать
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
      throw new NotFoundError(MESSAGES.NOT_FOUND);
    }
    res.status(STATUS_CODES.OK).send(user);
  })
    .then((user) => res.status(200)
      .send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(MESSAGES.BAD_REQUEST));
      } else {
        next(err);
      }
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
