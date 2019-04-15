const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ['Boss', 'Developer', 'TA'],
    default: 'Boss',
  }
},
{timestamps: {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
}}));