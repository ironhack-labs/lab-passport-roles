const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
  {
    email: String,
    role: {
      type: String,
      enum: ["BOSS", "DEVELOPER", "TA"]
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.plugin(passportLocalMongoose, { usernameField: 'email'})

module.exports = mongoose.model('User', userSchema)
