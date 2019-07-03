const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    //required: true,
    //unique: true
  },
  password: {
    type: String,
    //required: true
  },
  githubId: String,
  facebookId: String,
  role: {
    type: String,
    enum: ['BOSS', 'DEVELOPER', 'TA', 'STUDENT'],
    default: 'STUDENT'
  },
  firstName: String,
  lastName: String,
  profilePic: String,
}, {
  timestamps: { 
    createdAt: "created_at", updatedAt: "updated_at" 
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;