const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = mongoose.Schema({
  name:{
    type: String
  },
  role: {
    type: String,
    enum : ['Boss', 'Developer', 'TA'],
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = {user: User};
