const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { MESSAGES, STATUS_CODES } = require('../utils/constants');
const {
  BadRequestError, NotFoundError, ConflictError, UnauthorizedError,
} = require('../errors');
const { JWT_KEY } = require('../utils/constants');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    }).then((user) => {
      res.status(STATUS_CODES.OK).send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    }).catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(`${MESSAGES.BAD_REQUEST}. Такой пользователь уже зарегистрирован`));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`${MESSAGES.BAD_REQUEST} при создании пользователя`));
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
          // return res.cookie(('jwt', token, {
          //   maxAge: 3600000 * 24 * 7,
          //   httpOnly: true,
          // })).send({ token });
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
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MESSAGES.NOT_FOUND);
      }
      res.status(STATUS_CODES.OK).send(user);
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
      } else if (err.message === 'NotFound') {
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
    if (user) return res.status(STATUS_CODES.OK).send(user);
    throw new NotFoundError(MESSAGES.NOT_FOUND);
  })
    .then((user) => res.status(STATUS_CODES.OK).send(user))
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
