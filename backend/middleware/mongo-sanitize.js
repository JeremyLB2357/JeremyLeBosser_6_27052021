const sanitize = require('mongo-sanitize');

module.exports = (req, res, next) => {
    sanitize(req.params);
    sanitize(req.body);
    next();
};
