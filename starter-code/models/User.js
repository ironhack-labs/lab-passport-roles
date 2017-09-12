// models/user.js
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  name: String,
  FamilyName: String,
  password: String,
  role:{
    type: String,
    enum : ['BOSS', 'DEVELOPER', 'TA'],
    default : 'TA'
    },

}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
