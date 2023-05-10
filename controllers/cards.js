const Card = require('../models/card');
const { STATUS_CODES, MESSAGES } = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch {
    (err) =>
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send({ message: err.message });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(STATUS_CODES['200_OK']).send(card);
  } catch (err) {
    if ((err.status = 400)) {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(MESSAGES['400_BAD_REQUEST']);
    } else if ((err.status = 500)) {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send({ message: err.message });
    }
  }
};

const deleteCardById = async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      res
        .status(STATUS_CODES['404_NOT_FOUND'])
        .send({ message: MESSAGES['404_NOT_FOUND'] });
    }
    res.send(card);
  } catch (err) {
    res
      .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
      .send({ message: err.message });
  }
};

const likeCard = async (req, res) => {
  try {
    const cards = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!cards) {
      return res
        .status(STATUS_CODES['404_NOT_FOUND'])
        .send(MESSAGES['404_NOT_FOUND']);
    }
    // const updatedCards = await Card.findOne(userId);
    // res.send(updatedCards);
    res.send(cards);
  } catch (err) {
    if ((err.status = 400)) {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(MESSAGES['400_BAD_REQUEST']);
    } else if ((err.status = 500)) {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send({ message: err.message });
    }
  }
};

const dislikeCard = async (req, res) => {
  try {
    const cards = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!cards) {
      return res
        .status(STATUS_CODES['404_NOT_FOUND'])
        .send(MESSAGES['404_NOT_FOUND']);
    }
    res.send(cards);
  } catch (err) {
    if ((err.status = 400)) {
      res
        .status(STATUS_CODES['400_BAD_REQUEST'])
        .send(MESSAGES['400_BAD_REQUEST']);
    } else if ((err.status = 500)) {
      res
        .status(STATUS_CODES['500_INTERNAL_SERVER_ERROR'])
        .send({ message: err.message });
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
