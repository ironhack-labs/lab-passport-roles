const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  rol: {enum: ["Boss", "Developer", "TA"]}
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;