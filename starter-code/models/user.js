const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ["Boss", "Developer", "TA"]
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
