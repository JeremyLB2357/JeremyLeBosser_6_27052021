const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.post('/', auth, multer, sauceCtrl.addOne);
router.put('/:id', auth, multer,sauceCtrl.modifyOne);
router.delete('/:id', auth, sauceCtrl.delete);
router.get('/:id', auth, sauceCtrl.showOne);
router.get('/', auth, sauceCtrl.showAll);



module.exports = router;