const mongoose = require('mongoose');
const Schema = mongoose.Schema
const userSchema = new Schema({
    userName: {type: String, required: true},
    role: {
        type: String,
        enum: ["Boss", "Developer", "TA"],
        default: "TA"
    },
    password: {type: String}
});

userSchema.virtual("isBoss").get(function() {
    return this.role === "Boss"
});

const User = mongoose.model("User", userSchema);

module.exports = User;