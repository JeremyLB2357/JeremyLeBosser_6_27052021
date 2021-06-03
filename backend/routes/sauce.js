const express = require('express');
const router = express.Router();

const multer = require('multer');

const sauceCtrl = require('../controllers/sauce');

router.post('/', multer().any(), sauceCtrl.addOne);
//router.put('/:id', sauceCtrl.modifyOne);
//router.delete('/:id', sauceCtrl.deleteOne);
router.use('/:id', sauceCtrl.showOne);
router.use('/', sauceCtrl.showAll);



module.exports = router;