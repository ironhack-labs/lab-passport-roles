const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum : ['STUDENT', 'BOSS', 'TA','MANAGER','DEVELOPER'],
    default : 'ALUMNI'
  },
  facebookID: String,
  courses:Array
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;