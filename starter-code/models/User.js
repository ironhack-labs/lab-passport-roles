const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: String,
  password: String,
  role: {
    type: String,
    enum : ['DEVELOPER','TA', 'BOSS'],
    default : 'DEVELOPER'
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;