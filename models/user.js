const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    /// ...
    username:  String,
    password:  String,
    role: {
      type: String,
      enum : ['BOSS', 'DEVELOPER', 'TA'],
      default : 'BOSS'
    },
  });

  const User = mongoose.model("User",userSchema);

  module.exports=User;