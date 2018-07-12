const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  role: { type: String, enum : ['TA', 'BOSS', 'DEVELOPER', 'ALUMNI'], default : 'DEVELOPER' }
});

// const userSchema = new Schema({
//   name:  String,
//   email: String,
//   role: {
//     type: String,
//     enum : ['TA', 'BOSS', 'DEVELOPER', 'ALUMNI'],
//     default : 'DEVELOPER'
//   },
// });

const User = mongoose.model("User", userSchema);
module.exports = User;
