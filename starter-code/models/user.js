const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ["Boss", "Developer", "TA"],
    default: "Developer"
  }
});

module.exports = mongoose.model("User", userSchema);
