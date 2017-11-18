const mongoose=require('mongoose');
const Schema =mongoose.Schema;
const TYPES    = require('./roles');

const userSchema = new Schema ({
  username: String,
  name : String,
  familyName : String,
  password: String,
  role: String
});

const User= mongoose.model("User",userSchema);
module.exports = User;
