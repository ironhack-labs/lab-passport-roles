const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  surname: String,
  username: String,
  password: String,
  role: { type: String, enum: ['Boss', 'Developer', 'TA', 'Alumni'], default: 'Alumni'},
}, 
{
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;