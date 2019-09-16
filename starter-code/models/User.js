const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['BOSS', 'DEVELOPER', 'TA'],
    // default: 'BOSS'
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;