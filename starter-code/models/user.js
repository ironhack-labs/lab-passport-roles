const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  role:{type:String, enum:["Boss","Developer", "TA"], default:"Developer"},
  slack_id:String
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
