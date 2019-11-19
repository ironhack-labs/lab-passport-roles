const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: [
            "BOSS",
            "DEVELOPER",
            "TA"
        ],
        default: "DEVELOPER"
    }
})

const userModel = mongoose.model("users", userSchema);
module.exports = userModel