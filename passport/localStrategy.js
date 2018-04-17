const passport = require("passport");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;

const path = require("path");
const app_name = require("../package.json").name;


passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect password" });
      }
      return next(null, user);
    });
  })
);