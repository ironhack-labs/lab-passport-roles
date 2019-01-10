const mongoose = require('mongoose');
const User = require('../models/user');

const dbName = 'lab-role';
mongoose.connect('mongodb://localhost/${dbName}');

const userSchema = mongoose.Schema({
    username: String,
    password:String,
    role: {
      type: String,
      enum : ['Boss', 'Developer', 'TA'],
      default : 'Developer'
    },
  });

  const User = mongoose.model("User", userSchema);
  module.exports = User;