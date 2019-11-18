const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    role: {
        type: String,
        required: true,
        enum: ['boss', 'developer', 'ta'],
        default: 'boss'
    }
}, {
    timestamps: { timestamps: true }
});

const User = mongoose.model("User", userSchema);

module.exports = User