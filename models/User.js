const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new require("mongoose").Schema(
  {
    username: String,
    role: {
      type: String,
      enum: ["Boss", "Developer", "TA"],
      default: "Developer"
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

userSchema.plugin(passportLocalMongoose);

module.exports = require('mongoose').model('User', userSchema);