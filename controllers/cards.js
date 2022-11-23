const Card = require('../models/card');

const serverError = 500;
const badRequest = 400;
const notFound = 404;
const ok = 200;

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(serverError).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Некорректные данные' });
      } else {
        res
          .status(serverError)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: 'карточку потеряли' });
      } else {
        res.status(ok).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Невалидный id' });
      } else {
        res
          .status(serverError)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: 'карточку потеряли' });
      } else {
        res.status(ok).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(badRequest)
          .send({ message: 'Миша, карточки не очень, переделывай' });
      } else if (err.name === 'CastError') {
        res
          .status(badRequest)
          .send({ message: 'Передан невалидный id карточки' });
      } else {
        res.status(serverError).send({ message: `${err.message}` });
      }
    });
};

module.exports.unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: 'карточку потеряли' });
      } else {
        res.status(ok).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(badRequest)
          .send({ message: 'Миша, карточки не очень, переделывай' });
      } else if (err.name === 'CastError') {
        res
          .status(badRequest)
          .send({ message: 'Передан невалидный id карточки' });
      } else {
        res.status(serverError).send({ message: `${err.message}` });
      }
    });
};
