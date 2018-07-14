const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  facebookID: String,
  role: {
    type:String,
    enum:['BOSS','DEVELOPER','TA','STUDENT'],
    default:'DEVELOPER'
  }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;