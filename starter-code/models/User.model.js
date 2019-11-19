const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  role: {
    type: String,
    required: true,
    enum: ['TA', 'Developer', 'Boss'],
    default: 'GUEST'
  }
}, {
  timestamps: { timestamps: true }
});

const User = mongoose.model("User", userSchema);

module.exports = User