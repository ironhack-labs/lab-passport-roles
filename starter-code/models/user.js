const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  name: String,
  familyName: String,
  password: String,
  role: {
    type: String,
    enum: ["BOSS", "DEVELOPER", "TA", "GUEST"],
    default: "GUEST"
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
