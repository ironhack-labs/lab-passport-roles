const mongoose = require('mongoose');
const { Schema , model } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true
    },
    facebookId: {
      type: String,
      default: ''
    },
    displayName: {
      type: String,
      default: ''
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ['Boss','Developer','TA','Student'],
      default: 'Student'
    }
  },
  { timestamps: true },
);

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  hashField: 'password'
});

module.exports = model('User', userSchema);