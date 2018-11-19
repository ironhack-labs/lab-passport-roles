const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  role: {type: String, enum: ['Boss', 'Developer', 'TA']}
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;