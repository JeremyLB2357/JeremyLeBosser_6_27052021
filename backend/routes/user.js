const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const userCtrl = require('../controllers/user');

router.post('/signup', validator, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;