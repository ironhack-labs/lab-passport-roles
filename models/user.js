const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    /// ...
    name: String,
    lastname: String,
    age: Number,
    gender: String,
    interest: String,
    university: String,
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