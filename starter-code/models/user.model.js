const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    role: {
        type: String,
        enum: ['BOSS', 'TA', 'DEVELOPER','STUDENT'],
        //default: 'BOSS' decomentar esta linea para crear el primer boss
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User