const User = require('../models/user');
const { STATUS_CODES, MESSAGES } = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(STATUS_CODES['200_OK']).send(users);
  } catch (err) {
    res
      .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
      .send(MESSAGES['500_INTERNAL_SERVER_ERROR']);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params).orFail();
    res.status(STATUS_CODES['200_OK']).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(MESSAGES['400_BAD_REQUEST']);
    } else if (err.name === 'DocumentNotFoundError') {
      res
        .status(STATUS_CODES['404_NOT_FOUND'])
        .send(`Пользователь по указанному _id не найден`);
    } else {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send(MESSAGES['500_INTERNAL_SERVER_ERROR']);
    }
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(STATUS_CODES['200_OK']).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(`{MESSAGES['400_BAD_REQUEST']} при создании пользователя`);
    } else {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send(MESSAGES['500_INTERNAL_SERVER_ERROR']);
    }
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
      }
    ).orFail();
    res.status(STATUS_CODES['200_OK']).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(`{MESSAGES['400_BAD_REQUEST']} при обновлении профиля`);
    } else if (err.status === 'DocumentNotFoundError') {
      res
        .status(STATUS_CODES['404_NOT_FOUND'])
        .send(`Пользователь с указанным _id не найден`);
    } else {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send(MESSAGES['500_INTERNAL_SERVER_ERROR']);
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
    res.status(STATUS_CODES['200_OK']).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(`{MESSAGES['400_BAD_REQUEST']} при обновлении аватара`);
    } else if (err.status === 'DocumentNotFoundError') {
      res
        .status(STATUS_CODES['404_NOT_FOUND'])
        .send(`Пользователь с указанным _id не найден`);
    } else {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send(MESSAGES['500_INTERNAL_SERVER_ERROR']);
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
