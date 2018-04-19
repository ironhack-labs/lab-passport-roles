const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: { type: String },
  encryptedPassword: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ['TA', 'Developer', 'Boss'],
    default: 'Developer'
  }
});

userSchema.virtual('isBoss').get(function() {
  return this.role === 'Boss';
});

const User = mongoose.model('User', userSchema);

module.exports = User;