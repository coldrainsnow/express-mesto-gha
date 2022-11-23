const router = require('express').Router();

const {
  getAllCards,
  deleteCardById,
  createCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.delete('/:cardId', deleteCardById);
router.post('/', createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', unlikeCard);

module.exports = router;
