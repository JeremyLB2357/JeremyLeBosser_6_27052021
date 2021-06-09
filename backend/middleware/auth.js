const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        User.findOne({ _id: userId })
            .then(() => {
                console.log('je passe à la suite');
                next();
            })
            .catch(() => {
                throw 'Invalid user ID';
            });
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};