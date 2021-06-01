const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    User.findOne({ email: req.body.email })     //on cherche dans la BDD
        .then( user => {
            if (!user) {
                return res.status(401).json({ error: 'utilisateur inconnu !' });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then( valid => {
                        if (!valid) {
                            return res.status(401).json({ error: 'mot de passe incorrect !' });
                        } else {    //renvoie l'identifiant userID depuis la BDD et un jeton Web JSON signé contenant userID
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    'RANDOM_TOKEN_SECRET',
                                    { expiresIn: '24h' }
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};
