const mongoose = require("mongoose");
const Schema   = mongoose.Schema;


const userSchema = new Schema({
  username: String,
  name: String,
  surname: String,
  address: String,
  password: String,
  role: {
    type: String,
    enum : ['Boss', 'Developer', 'TA', 'Student']
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;