const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  isAdmin: Boolean,
  role: {
    type: String,
    enum : ['DEVELOPER', 'TA', 'BOSS', 'STUDENT'],
    default: "STUDENT"
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;