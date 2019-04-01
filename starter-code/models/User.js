const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  name: String,
  email: String,
  password: String, 
  role: {
    type: String,
    enum : ['BOSS', 'DEV', 'TA'],
    default : 'GUEST'
  },
}, {
  timestamps: true
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  hashField: "password"
});

module.exports = mongoose.model("User", userSchema);