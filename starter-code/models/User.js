const mongoose = require('mongoose');

const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: { type:String, unique: true, required: true },
  password: { type : String, default: 'ironhack' },
  role: { type : String, enum: ['Boss', 'Developer', 'TA'], default: 'Developer' },

});

const User = mongoose.model('User', userSchema);
module.exports = User;
