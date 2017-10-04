const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    name: String,
    familyName: String,
    role: {
        type: String,
        enum: ['Boss', 'Developer', 'TA'],
        default: 'Developer'
    },
 }, {
        timestamps: {
            createdAt: 'created_at',
            updateAt: 'update_at'
        }
})

const User = mongoose.model('User', userSchema)

module.exports = User;