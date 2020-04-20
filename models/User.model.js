const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, unique: true },
    name: String,
    password: String,
    profileImg: {
        required: true,
        type: String,
        default: "../images/profile.png"
    },
    description: String,
    facebookId: String,
    role: {
        type: String,
        enum: ['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST'],
        required: true,
        default: 'GUEST'
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;