const rateLimit = require('express-rate-limit');

exports.global = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
    //100 requetes toutes les 15 minutes
});

exports.connexion = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10
    //10 requtes toutes les 15 minutes
});