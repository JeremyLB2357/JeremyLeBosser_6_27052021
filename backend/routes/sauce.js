const express = require('express');
const router = express.Router();

const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.post('/', multer, sauceCtrl.addOne);
router.put('/:id', multer,sauceCtrl.modifyOne);
router.delete('/:id', sauceCtrl.delete);
router.get('/:id', sauceCtrl.showOne);
router.get('/', sauceCtrl.showAll);



module.exports = router;