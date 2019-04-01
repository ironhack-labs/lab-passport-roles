const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  facebookId: String,
  displayName: String,
  name: String,
  lastname: String,
  email: String,
  password: String, 
  role: {
    type: String,
    enum : ['BOSS', 'DEV', 'TA', 'STUDENT'],
    default : 'STUDENT'
  },
}, {
  timestamps: true
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  hashField: "password"
});

module.exports = mongoose.model("User", userSchema);


// INSTALAR            $ npm install passport-facebook
// PARA FACEBOOK       $ npm install express-session