const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  role: {
    type: String,
    enum : ['BOSS', 'DEVELOPER', 'TA']
  },
  firstName: {type: String, required: true},
  lastName: String,
  age: Number,
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;