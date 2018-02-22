const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    name: String,
    email: String,
    role: {
        type: String,
        enum: ['Boss', 'Developer', 'TA'],
        default: 'Guest'
    },
});

const User = mongoose.model("User", userSchema)

module.exports = User;