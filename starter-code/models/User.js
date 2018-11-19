const mongoose = require("mongoose");
const Schema   = mongoose.Schema;


const UserSchema = Schema({
  name:  String,
  email: String,
  role: {
    type: String,
    enum : ['Boss', 'Developer', 'TA'],
    default : 'Developer'
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;