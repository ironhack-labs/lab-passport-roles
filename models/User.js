const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  isAdmin: Boolean,
  role: [{
    type: String,
    enum : ['boss', 'ta', 'developer'],
  }]
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;

