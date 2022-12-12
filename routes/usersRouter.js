const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const { URL_REGEX } = require('../utils/constants');

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
  }),
  getUserById
);
router.post('/', createUser);
router.patch(
  '/me',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUserInfo
);
router.patch(
  '/me/avatar',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string().required().regex(URL_REGEX),
    }),
  }),
  updateUserAvatar
);

module.exports = router;
