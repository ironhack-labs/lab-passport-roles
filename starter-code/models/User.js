const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    username: String,
    role: {
      type: String,
      enum: ["Boss", "Developer", "TA"]
    },
    age: Number,
    email: String
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true
    }
  }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "username" });

module.exports = mongoose.model("User", userSchema);
