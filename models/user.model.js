const mongoose = require("mongoose");
const constants = require("../constants");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const FIRST_EMAIL_BOSS = process.env.FIRST_EMAIL_BOSS;

const userSchema = new mongoose.Schema({
  email: {
      type: String,
      required: [true, "email is required"],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
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
    token: {
      type: String,
    },
    active: {
      type:Boolean,
      default: false
    },
    courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
  },
  { timestamps: true }
);

//pre saving document
userSchema.pre("save", function(next) {
  //assign first email to boss
  if (this.email === FIRST_EMAIL_BOSS) {
    this.role = constants.users.BOSS;
  }
  //generate token to new users
  if (this.active === false) { //this.isNew tambien vale
    this.token = this.generateToken();
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

//model methods
userSchema.methods.generateToken = function(){
  return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
};

userSchema.methods.checkPassword = function(passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
