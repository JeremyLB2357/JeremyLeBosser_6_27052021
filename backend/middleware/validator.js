const validator = require('validator');

module.exports = (req, res, next) => {
    const checkEmail = validator.isEmail(req.body.email);
    const checkPassword = validator.isStrongPassword(req.body.password);
    if (checkEmail && checkPassword) {
        next();
    } else {
        try {
            if (!checkEmail) {
                throw "l'adresse mail n'est pas correcte";
            } else {
                throw "le mot de passe est trop faible";
            }
        } catch (error) {
            res.status(400).json({ error: error});
        }
    }
}