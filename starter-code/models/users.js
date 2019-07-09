const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    enum: ['BOSS', 'DEVELOPER', 'TA'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
