const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: String,
  name: String,
  familyName: String,
  password: String,
  role: {
    type: String,
    enum : ['Boss', 'Developer', 'TA'],
    default : 'TA'
  },
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
