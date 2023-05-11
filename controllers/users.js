const User = require('../models/user');
const { STATUS_CODES, MESSAGES } = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(STATUS_CODES.OK).send(users);
  } catch (err) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail();
    res.status(STATUS_CODES.OK).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: `${MESSAGES.BAD_REQUEST}` });
    } else if (err.name === 'DocumentNotFoundError') {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .send({ message: `Пользователь по указанному _id не найден` });
    } else {
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(STATUS_CODES.OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(STATUS_CODES.BAD_REQUEST).send({
        message: `${MESSAGES.BAD_REQUEST} при создании пользователя`,
      });
    } else {
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

const updateUser = async (req, res) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      }
    ).orFail();
    res.status(STATUS_CODES.OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: `${MESSAGES.BAD_REQUEST} при обновлении профиля` });
    } else if (err.name === 'DocumentNotFoundError') {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .send({ message: `Пользователь с указанным _id не найден` });
    } else {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

const updateAvatar = async (req, res) => {
  try {
    // const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, req.body.avatar, {
      new: true,
      runValidators: true,
    }).orFail();
    res.status(STATUS_CODES.OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: `${MESSAGES.BAD_REQUEST} при обновлении аватара` });
    } else if (err.name === 'DocumentNotFoundError') {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .send({ message: `Пользователь с указанным _id не найден` });
    } else {
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
