/*jshint esversion: 6 */

const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    password: String,
    role: {
        type: String,
        enum: ['Boss', 'Developer', 'TA'],
        default: 'TA'
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
module.exports = User