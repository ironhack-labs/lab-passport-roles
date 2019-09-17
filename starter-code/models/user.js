
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
    enum: ['Boost', 'Developer', 'TA'],
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;

const RoomSchema = Schema({
  name:  String,
  desc:  String,
  owner:userSchema,
});