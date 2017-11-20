const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  username: String,
  familyName: String,
  password: String,
  role: {
    type: String,
    enum: ['Boss', 'Developer', 'TA'],
    default : 'Developer'
  }
});

userSchema.set('timestamps', true);

const User = mongoose.model('User', userSchema);

module.exports = User;
