const rateLimit = require('express-rate-limit');

exports.global = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 50
    //50 requetes toutes les 2 minutes
});

exports.connexion = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20
    //20 requtes toutes les 15 minutes
});