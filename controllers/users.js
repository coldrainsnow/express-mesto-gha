const User = require('../models/user');

const serverError = 500;
const badRequest = 400;
const notFound = 404;

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(serverError).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((users) => {
      if (!users) {
        res.status(notFound).send({ message: 'Такого пользователя нет' });
      } else {
        res.send(users);
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

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Невалидный id' });
      } else {
        res
          .status(serverError)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Ошибка валидации' });
      } else if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Ошибка в id пользователя' });
      } else {
        res.status(serverError).send({ message: `${err.message}` });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'что-то с аватаркой' });
      } else if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Ошибка в id пользователя' });
      } else {
        res.status(serverError).send({ message: `${err.message}` });
      }
    });
};
