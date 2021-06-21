const sauce = require("../models/sauce")
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (userId == sauce.userId) {
                next();
            } else {
                console.log('test');
                res.status(401).json({ error: 'demande non authorisée' });
            }
        })
        .catch(error => res.status(404).json({ error }));
}