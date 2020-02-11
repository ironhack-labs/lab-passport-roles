const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  role: {type: String, enum: ['Boss', 'Developer', 'TA'], default: 'Developer'},
},
{ timestamps: true },
);

const User = mongoose.model('user', userSchema);

module.exports = User;