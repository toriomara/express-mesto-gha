const User = require('../models/user');
const { STATUS_CODES, MESSAGES } = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(STATUS_CODES['200_OK']).send(users);
  } catch (err) {
    if (err.status === 500) {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send({ message: err.message });
    }
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.send(user);
  } catch (err) {
    if (err.status === 404) {
      res
        .status(STATUS_CODES['404_NOT_FOUND'])
        .send({ message: MESSAGES['404_NOT_FOUND'] });
    } else if (err.status === 500) {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send({ message: err.message });
    }
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    if (err.status === 400) {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(MESSAGES['400_BAD_REQUEST']);
    } else if (err.status === 500) {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send({ message: err.message });
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const userId = req.params._id;
    const user = await User.findOneAndUpdate(
      userId,
      { name, about },
      {
        new: true,
        upsert: true,
      }
    );
    if (!user) {
      return res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(MESSAGES['400_BAD_REQUEST']);
    }
    const updatedUser = await User.findOne(userId);
    res.send(updatedUser);
  } catch (err) {
    if (err.status === 400) {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(MESSAGES['400_BAD_REQUEST']);
    } else if (err.status === 500) {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send({ message: err.message });
    }
    res.status(500).send({ message: err.message });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.params._id;
    const user = await User.findOneAndUpdate(userId, { avatar });
    if (!user) {
      return res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(MESSAGES['400_BAD_REQUEST']);
    }
    const updatedUser = await User.findOne(userId);
    res.send(updatedUser);
  } catch (err) {
    if (err.status === 400) {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(MESSAGES['400_BAD_REQUEST']);
    } else if (err.status === 500) {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send({ message: err.message });
    }
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
