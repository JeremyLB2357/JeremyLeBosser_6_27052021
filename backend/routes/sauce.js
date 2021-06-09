const express = require('express');
const router = express.Router();

const rateLimit = require('../middleware/rate-limit');
const auth = require('../middleware/auth');
const sanitize = require('../middleware/mongo-sanitize');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.post('/', rateLimit.global, auth, sanitize, multer, sauceCtrl.addOne);
router.put('/:id', rateLimit.global, auth, sanitize, multer, sauceCtrl.modifyOne);
router.delete('/:id', rateLimit.global, auth, sanitize, sauceCtrl.delete);
router.get('/:id', rateLimit.global, auth, sanitize, sauceCtrl.showOne);
router.get('/', rateLimit.global, auth, sauceCtrl.showAll);

router.post('/:id/like', auth, sauceCtrl.like);

module.exports = router;