// models/user.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  enum: ["GUEST", "EDITOR", "ADMIN"]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
