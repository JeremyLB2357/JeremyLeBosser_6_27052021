const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    userId: { type: String, required: true, unique: true}, //doit etre unique
    email: { type: String, required: true, unique: true}, //doit etre unique
    password: { type: String, required: true}, //doit etre chiffré
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);