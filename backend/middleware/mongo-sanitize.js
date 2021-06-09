const sanitize = require('mongo-sanitize');

module.exports = (req, res, next) => {
    console.log('je nettoye les entrées');
    sanitize(req.params);
    sanitize(req.body);
    next();
};
