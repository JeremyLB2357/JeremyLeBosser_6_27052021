const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const sanitize = require('../middleware/mongo-sanitize');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.post('/', auth, sanitize, multer, sauceCtrl.addOne);
router.put('/:id', auth, sanitize, multer, sauceCtrl.modifyOne);
router.delete('/:id', auth, sanitize, sauceCtrl.delete);
router.get('/:id', auth, sanitize, sauceCtrl.showOne);
router.get('/', auth, sauceCtrl.showAll);

router.post('/:id/like', auth, sauceCtrl.like);

module.exports = router;