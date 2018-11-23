const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  role:{type:String, enum:["Boss","Developer","TA", "Student"], default:"Student"},
  slack_id:String,
  facebookID: String
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
