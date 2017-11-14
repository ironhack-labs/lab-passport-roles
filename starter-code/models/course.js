const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  startingDate: Number,
  endDate: Number,
  level: String,
  available: Boolean
});

const User = mongoose.model("User", userSchema);

module.exports = User;
