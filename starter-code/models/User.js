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
  name: {
    type: String,
  },
  info: {
    type: String,
  },
  role: {
    type: String,
    enum: ['Boss', 'Developer', 'TA', 'Student'],
    default: 'Student',
  },
  googleID: String,
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;