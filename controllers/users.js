const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const { getJwtToken } = require('../utils/jwt');
const { MESSAGES, STATUS_CODES } = require('../utils/constants');
const {
  BadRequestError, NotFoundError, ConflictError,
} = require('../errors');
const { JWT_KEY } = require('../middlewares/auth');

const createUser = async (req, res, next) => {
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
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${MESSAGES.BAD_REQUEST} при создании пользователя`));
        return;
      } if (err.code === 11000) {
        next(new ConflictError(`${MESSAGES.BAD_REQUEST}. Такой пользователь уже зарегистрирован`));
      } else {
        next(err);
      }
    });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.id }, JWT_KEY, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ jwt: token });
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
    .orFail(() => new NotFoundError(MESSAGES.NOT_FOUND))
    .then((user) => {
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
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError(MESSAGES.NOT_FOUND);
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(MESSAGES.BAD_REQUEST));
    }
    next(err);
  }
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
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(STATUS_CODES.OK).send(user);
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
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
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(STATUS_CODES.OK).send(user);
  }).catch((err) => {
    if (err.name === 'ValidationError') {
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
