const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

mongoose.models = {};
mongoose.modelSchemas = {};

const userSchema = new Schema({
  username: String,
  name: String,
  familyName: String,
  password: String,
  role: {
    type: String,
    enum : ['Boss', 'Developer', 'TA'],
    default : 'Boss'
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
