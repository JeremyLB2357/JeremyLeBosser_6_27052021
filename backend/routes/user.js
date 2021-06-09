const express = require('express');
const router = express.Router();

const rateLimit = require('../middleware/rate-limit');
const sanitize = require('../middleware/mongo-sanitize');
const validator = require('../middleware/validator');
const userCtrl = require('../controllers/user');



router.post('/signup', rateLimit.connexion, validator, sanitize, userCtrl.signup);
router.post('/login', rateLimit.connexion, sanitize, userCtrl.login);

module.exports = router;