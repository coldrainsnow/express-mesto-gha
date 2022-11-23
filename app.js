const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser"');

const userRouter = require('./routes/usersRouter');
const cardsRouter = require('./routes/cardsRouter');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '637c9cc6e0b8a01a0e479f64',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.listen(PORT);
