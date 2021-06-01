const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)  //chiffre le mot de pase
        .then( hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()     //ajoute l'utilisateur à la BDD
                .then(() => res.status(201).json({ message: 'merci de votre inscription'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'vous êtes connecté'
    });
    //vérifie les info de l'utilisateur et renvoie l'identifiant userID depuis la BDD et un jeton Web JSON signé contenant userID
};
