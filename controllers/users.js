const bcrypt = require('bcrypt');
const User = require('../models/user');
const { getJwtToken } = require('../utils/jwt');
const { MESSAGES } = require('../utils/constants');
const {
  BadRequestError, NotFoundError, ConflictError, UnauthorizedError,
} = require('../errors');

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const saltRounds = 10;
  try {
    const hashPassword = await bcrypt.hash(password, saltRounds);
    await User.create({
      name, about, avatar, email, password: hashPassword,
    });
    return res.send({
      name, about, avatar, email,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError('Такой пользователь уже существует'));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = User.findOne({ email }).select('+password');
    // const user = await User.findByCredentials(email, password);
    console.log(email);
    const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!email || !password) {
    //   return next(new UnauthorizedError('Email или пароль не могут быть пустыми'));
    // }
    if (user || isValidPassword) {
      const token = getJwtToken(user._id);
      return res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ jwt: token });
    }
    return next(new UnauthorizedError(MESSAGES.UNAUTHORIZED));
  } catch (err) {
    return next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).orFail();
    if (!user) {
      throw new NotFoundError(MESSAGES.NOT_FOUND);
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(MESSAGES.BAD_REQUEST));
    }
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    ).orFail();
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(`${MESSAGES.BAD_REQUEST} при обновлении профиля`));
    }
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Пользователь по указанному _id не найден'));
    }
    return next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    ).orFail();
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(`${MESSAGES.BAD_REQUEST} при обновлении аватара`));
    }
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Пользователь по указанному _id не найден'));
    }
    return next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
