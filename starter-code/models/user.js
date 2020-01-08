const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  role: {
    type: String,
    enum : ['BOSS', 'DEVELOPER', 'TA'],
    default : 'TA'
  },
  
  username: {
    type: String,
    unique: true,
    required: true

  },
  password: {
    type: String,
    required: true
  }
}, 

{
  timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;