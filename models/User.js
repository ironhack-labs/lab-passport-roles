const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  password: String,
  role: {type: String, enum: ['Boss', 'Developer', 'TA']}
});

const User = mongoose.model("User", userSchema);
module.exports = User;