const { NODE_ENV, SECRET_KEY } = process.env;
const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorizationError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError('Необходима авторизация'));
  } else {
    const token = authorization.replace('Bearer ', '');

    let payload;

    try {
      payload = jwt.verify(
        token,
        NODE_ENV === 'production' ? SECRET_KEY : 'dev-key'
      );
    } catch (err) {
      next(new AuthorizationError('Необходима авторизация'));
      return;
    }
    req.user = payload;
    next();
  }
};
