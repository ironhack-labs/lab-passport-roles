const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;

const path = require("path");
const app_name = require("../package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        console.log('error')
        return next(err);
      }
      if (!user) {
        console.log('no user')
        return next(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        console.log('bad passw')
        return next(null, false, { message: "Incorrect password" });
      }
      console.log(user)
      debug("User logged in!");
      return next(null, user);
    });
  })
);
