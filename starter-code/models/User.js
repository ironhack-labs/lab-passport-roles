const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    username: String,
    role: { type: String, enum: ["Boss", "Developer", "TA"], default: "TA" },
    password: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;
