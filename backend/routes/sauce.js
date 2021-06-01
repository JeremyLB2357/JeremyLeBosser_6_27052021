const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

router.get('/', sauceCtrl.showAll);
router.get('/:id', sauceCtrl.showOne);
router.post('/', sauceCtrl.addOne);
router.put('/:id', sauceCtrl.modifyOne);
router.delete('/:id', sauceCtrl.deleteOne);


module.exports = router;