const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    name: String,
    familyName: String,
    password: String,
    role: {
        type: String,
        enum: ['Boss', 'Developer', 'TA', 'Student'],
        default:'Student'
    },
  
    facebookID: String,
    googleID: String
  }, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  });
  
  const User = mongoose.model("User", userSchema);
  
  module.exports = User;