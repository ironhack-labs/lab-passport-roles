const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  role: {
    type: String,
    required: true,
    enum: ['Boss', 'Developer', 'TA', 'Student']
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;