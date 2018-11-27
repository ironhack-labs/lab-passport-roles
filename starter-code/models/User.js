const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  name: String,
  email: String,
  role: {
    type: String,
    enum: ["BOSS", "DEV", "TA"],
    default: "DEV"
  }
},{
  timestamps: {
    createdAt: true,
    updatedAt: true
  }
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
module.exports = mongoose.model("User", userSchema);