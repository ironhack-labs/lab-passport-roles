const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const Users = require("./../models/Users.model");

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  Users.findById(id, (err, user) => {
    next(err, user);
  });
});

passport.use(
  "local-auth",
  new LocalStrategy((username, password, done) => {
    Users.findOne({ username }, (err, userFound) => {
      // Check if there are an error
      if (err) return done(err);
      if (!userFound) return done(null, false);

      // Check if the password is correct
      const hashedPassword = userFound.password;
      if (!bcrypt.compareSync(password, hashedPassword)) {
        // Password does not matches
        return done(null, false);
      }

      return done(null, userFound);
    });
  })
);