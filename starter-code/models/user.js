const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  rol: {
    type: String,
    enum : ['Boss', 'TA', 'Developer'],
    default : 'Developer'
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;