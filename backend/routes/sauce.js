const express = require('express');
const router = express.Router();

const multer = require('multer');

const sauceCtrl = require('../controllers/sauce');

router.post('/', multer().any(), sauceCtrl.addOne);
//router.put('/:id', sauceCtrl.modifyOne);
//router.delete('/:id', sauceCtrl.deleteOne);
router.use('/', sauceCtrl.showAll);
//router.get('/:id', sauceCtrl.showOne);


module.exports = router;