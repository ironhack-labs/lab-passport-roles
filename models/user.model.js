const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    profileImg: {
        type: String,
        required: true,
        default: 'https://blog.netsarang.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png'
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    facebookId: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: ['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST'],
        default: 'GUEST'
    }
}, {
    timestamps: true
})


const User = mongoose.model('User', userSchema)

module.exports = User