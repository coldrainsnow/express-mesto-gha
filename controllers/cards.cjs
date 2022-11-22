const Card = require('../models/card.cjs');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then(card => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
}

module.exports.deleteCardById = (req, res) => {
  Card.remove({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
}
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Миша, карточки не очень, переделывай' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан невалидный id карточки' });
      } else if (res.statusCode === 404) {
        res.send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(internalServerError).send({ message: `${err.message}` });
      }
    });
};

module.exports.unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Миша, карточки не очень, переделывай' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан невалидный id карточки' });
      } else if (res.statusCode === 404) {
        res.send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(internalServerError).send({ message: `${err.message}` });
      }
    });
};