const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userShema = new Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ["TA", "DEVELOPER", "BOSS"],
    default: "DEVELOPER"
  }
});
const User = mongoose.model("User", userShema);
module.exports = User;
