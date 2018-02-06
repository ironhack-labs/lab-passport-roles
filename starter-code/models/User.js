const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema(
  {
    username: String,
    password: String,
    name: String,
    familyName: String,
    role: {
      type: String,
      enum: ["BOSS", "TA", "DEVELOPER"],
      default: "DEVELOPER"
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
