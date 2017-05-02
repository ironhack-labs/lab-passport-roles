const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  familyName: String,
  name: String,
  role: {
    type: String,
    enum : ['User','Ta', 'Developer', 'Boss'],
    default : 'User'
  },
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
