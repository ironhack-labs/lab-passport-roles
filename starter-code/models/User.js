const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ['Boss'],
    default: 'Boss',
  }
}))