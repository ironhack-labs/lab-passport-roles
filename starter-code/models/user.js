// models/user.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    name: String,
    familyName: String,
    facebookID: String,
    googleID: String,
    role: {
      type: String,
      enum: ["Boss", "Developer", "TA", "guest"],
      default: "guest"
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
