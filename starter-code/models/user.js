const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String, 
  role: {
    type: String,
    enum : ['BOSS', 'DEV', 'TA'],
    default : 'GUEST'
  },
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;