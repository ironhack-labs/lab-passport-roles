const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    name: String,
    familyName: String,
    password: String,
    role: {
        type: String,
        enum: ['BOSS', 'DEV', 'TA']
    }
});
const User = mongoose.model('User', userSchema);

module.exports = User;