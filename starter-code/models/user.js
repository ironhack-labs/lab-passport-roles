const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  familyname: String,
  username: String,
  password: String,
  role: {
    type: String,
    enum: ["Boss", "Developer", "TA"],
    default: "TA"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
