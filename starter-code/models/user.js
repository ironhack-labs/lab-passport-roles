const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  name: String,
  familyName: String,
  password: String,
  facebookID: String,
  role: {
    type: String,
    enum : ['BOSS', 'DEVELOPER', 'TA', 'STUDENT'],
    default : 'TA'
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
