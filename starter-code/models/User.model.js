const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
  role: String
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
