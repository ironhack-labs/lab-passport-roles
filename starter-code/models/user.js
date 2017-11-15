const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  name: String,
  password: String,
  familyName: String,
  role: {
    type: String,
    enum : ['Alumni', 'TA', 'Developer', 'Boss'],
    default : 'Alumni'
  },
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }

});

const User = mongoose.model("User", userSchema);
module.exports = User;
