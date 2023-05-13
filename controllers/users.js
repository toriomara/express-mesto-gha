const User = require('../models/user');
const { STATUS_CODES, MESSAGES } = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail();
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: `${MESSAGES.BAD_REQUEST}` });
    }
    if (err.name === 'DocumentNotFoundError') {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(STATUS_CODES.BAD_REQUEST).send({
        message: `${MESSAGES.BAD_REQUEST} при создании пользователя`,
      });
    }
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const updateUser = async (req, res) => {
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
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: `${MESSAGES.BAD_REQUEST} при обновлении профиля` });
    }
    if (err.name === 'DocumentNotFoundError') {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .send({ message: 'Пользователь с указанным _id не найден' });
    }
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const updateAvatar = async (req, res) => {
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
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: `${MESSAGES.BAD_REQUEST} при обновлении аватара` });
    }
    if (err.name === 'DocumentNotFoundError') {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .send({ message: 'Пользователь с указанным _id не найден' });
    }
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
