const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = Schema({
    name:  String,
    password:  String,
    role: {
        type: String,
        enum : ['Boss', 'Developer', 'TA'],
        default : 'Boss'
      },
    });

const User = mongoose.model("User", userSchema);
module.exports = User;