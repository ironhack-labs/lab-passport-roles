const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: True
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ["Boss", "Developer", "TA"]
  }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;

