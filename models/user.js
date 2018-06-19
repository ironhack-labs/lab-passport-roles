const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, default: "TA", enum: [ "Boss", "Developer", "TA" ] }
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;