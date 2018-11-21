const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    role: {
      type: String,
      enum: ["Boss", "Developer", "TA"],
      default: "TA"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Users", userSchema);
