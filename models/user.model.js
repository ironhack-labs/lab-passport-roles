const mongoose = require("mongoose");
const constants = require("../constants");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const FIRST_USERNAME_BOSS = process.env.FIRST_USERNAME_BOSS;

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true
    },
    password: {
      type: String,
      required: [true, "User needs a password"]
    },
    catchPhrase: {
      type: String,
      default: 'ookIt has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    role: {
      type: String,
      enum: [constants.users.BOSS, constants.users.DEVELOPER, constants.users.TA],
      default: constants.users.DEVELOPER
    },
    courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
  },
  { timestamps: true }
);

userSchema.pre("save", function(next) {
  if (this.username === FIRST_USERNAME_BOSS) {
    this.role = constants.users.BOSS;
  }
  
  if (!this.isModified("password")) {
    next();
  } else {
    bcrypt.genSalt(saltRounds)
    .then(saltValue => {
      return bcrypt.hash(this.password, saltValue);
    })
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(() => {
      this.password = null;
      next();
    });
  }
});

userSchema.methods.checkPassword = function(passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
