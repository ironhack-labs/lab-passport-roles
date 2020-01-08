const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  slackID: String,
  googleID: String,
  name: String,
  email: String,
  //Create an schema considering the following roles: Boss, Developer, TA.
  role: {
    type: String,
    enum: ['STUDENT', 'DEV', 'TA', 'BOSS'],
    default: 'STUDENT'
  },
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;