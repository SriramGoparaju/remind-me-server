const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    password: String,
    email: String,
    token: String,
});

module.exports = model('User', userSchema);