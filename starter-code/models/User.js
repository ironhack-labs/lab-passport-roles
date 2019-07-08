const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = mongoose.Schema({

  username: String,

  password: String,

  role: {
    type: String,
    enum : ['Boss', 'Developer', 'TA','Alumni'],
    default : 'Alumni'
  },
});

const User = mongoose.model('User',UserSchema);

module.exports = User;