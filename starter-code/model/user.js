const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    role: {
        type: String,
        enum: ['Boss', 'Developer', 'TA'],
        default: 'GUEST'
    },
});

const User = mongoose.model("user", userSchema);
module.exports = User;