const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ["developer", "TA", "Boss"],
    default: "developer"
  }
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
