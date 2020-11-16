const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema ({
    username:{
        type: String
    },
    password:{
        type: String
    },
    role: {
        type: String,
        enum: ['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']
    }
},{
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User