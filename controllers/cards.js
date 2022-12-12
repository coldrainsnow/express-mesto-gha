const Card = require('../models/card');

const BadRequestError = require('../errors/badRequest');
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');

const ok = 200;

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => {
      throw new NotFoundError(`Карточка с id: ${cardId} не найдена`);
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(cardId).then(() => res.send(card)).catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError('Миша, карточки не очень, переделывай'));
          } else {
            next(err);
          }
        });
      } else {
        throw new ForbiddenError('Нельзя удалять чужие карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestError(
            `Передан некорректны id: ${cardId} в методы удаления карточки`
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('карточку потеряли'));
      } else {
        res.status(ok).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Миша, карточки не очень, переделывай'));
      } else {
        next(err);
      }
    });
};

module.exports.unlikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('карточку потеряли'));
      } else {
        res.status(ok).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Миша, карточки не очень, переделывай'));
      } else {
        next(err);
      }
    });
};
