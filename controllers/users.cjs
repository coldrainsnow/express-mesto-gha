const User = require('../models/user.cjs');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
}

module.exports.getUserById = (req, res) => {
  User.find({})
    .then(users => {
      if (!users[req.params.id]) {
        res.send({ error: 'Такого пользователя нет' });
      }
      res.send(users[req.params.id]);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
}

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
        res.status(400).send({ message: 'Ошибка валидации' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка в id пользователя' });
      } else if (res.statusCode === 404) {
        res.send({ message: 'Пользователь не найден' });
      } else {
        res.status(internalServerError).send({ message: `${err.message}` });
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
        res.status(400).send({ message: 'что-то с аватаркой' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка в id пользователя' });
      } else if (res.statusCode === 404) {
        res.send({ message: 'Пользователь не найден' });
      } else {
        res.status(internalServerError).send({ message: `${err.message}` });
      }
    });
};