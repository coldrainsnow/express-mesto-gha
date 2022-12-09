const { NODE_ENV, SECRET_KEY } = process.env;
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Необходима авторизация" });
  } else {
    const token = authorization.replace("Bearer ", "");

    let payload;

    try {
      // попытаемся верифицировать токен
      payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET_KEY : 'dev-key');
    } catch (err) {
      // отправим ошибку, если не получилось
      return res.status(401).send({ message: "Необходима авторизация" });
    }
    req.user = payload; // записываем пейлоуд в объект запроса

    next();
  }
};
