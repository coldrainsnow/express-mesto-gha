const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }
      );
      res
        .cookie('jwt', token, {
          maxAge: 60 * 60 * 7 * 24,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Вы успешно авторизовались!' })
        .end();
    })
    .catch(next);
};
