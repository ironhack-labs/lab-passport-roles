const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {type: String, unique: true, require: true},
  password: {type: String, require: true},
  role: ['Boss', 'Developer', 'TA']
});

const User = mongoose.model('Users', userSchema);
module.exports = User;