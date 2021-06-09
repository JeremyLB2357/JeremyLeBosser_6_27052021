const express = require('express');
const router = express.Router();

const sanitize = require('../middleware/mongo-sanitize');
const validator = require('../middleware/validator');
const userCtrl = require('../controllers/user');

router.post('/signup', validator, sanitize, userCtrl.signup);
router.post('/login', sanitize, userCtrl.login);

module.exports = router;