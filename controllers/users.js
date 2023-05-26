const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const { getJwtToken } = require('../utils/jwt');
const { MESSAGES } = require('../utils/constants');
const {
  BadRequestError, NotFoundError, ConflictError,
} = require('../errors');
const { JWT_KEY } = require('../middlewares/auth');

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds).than((hashPassword) => {
    User.create({
      name, about, avatar, email, password: hashPassword,
    }).then((user) => {
      res.send({
        user,
        // _id: user._id,
        // name: user.name,
        // about: user.about,
        // avatar: user.avatar,
        // email: user.email,
      });
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${MESSAGES.BAD_REQUEST} при создании пользователя`));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError(MESSAGES.BAD_REQUEST));
        return;
      }
      next(err);
    });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.id }, JWT_KEY, { expiresIn: '7d' });
      // res.send({ token, message: 'Вы авторизованы' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ jwt: token });
    })
    .catch(next);
};

// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     // const user = User.findOne(email).select('+password');
//     const user = User.findUserByCredentials(email, password);
//     if (!user) {
//       return next(new NotFoundError(MESSAGES.NOT_FOUND));
//     }
//     console.log(email);
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!email || !password) {
//       return next(new UnauthorizedError('Email или пароль не могут быть пустыми'));
//     }
//     if (!user || !isValidPassword) {
//       return next(new UnauthorizedError('Email или пароль не могут быть пустыми'));
//     }
//     const token = getJwtToken(user._id);
//     return res
//       .cookie('jwt', token, {
//         maxAge: 3600000 * 24 * 7,
//         httpOnly: true,
//       })
//       .send({ jwt: token });
//   } catch (err) {
//     return next(err);
//   }
// };

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError(MESSAGES.NOT_FOUND)).then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(MESSAGES.BAD_REQUEST));
      }
      return next(err);
    });
};

const getYourself = (req, res, next) => {
  User.findById(req.user_id).then((user) => {
    if (!user) {
      throw new NotFoundError(MESSAGES.NOT_FOUND);
    }
    res.send(user);
  }).catch(next);
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
  getYourself,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
