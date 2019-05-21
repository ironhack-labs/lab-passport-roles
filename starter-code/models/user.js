const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

// const userSchema = new Schema({
//   username: String,
//   password: String
// }, {
//   timestamps: true
// });

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum : [ 'BOSS', 'DEVELOPER', 'TA'],
    //default : 'GUEST'
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;