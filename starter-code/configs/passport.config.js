require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const Users = require("./../models/Users.model");
const GitHubStrategy = require("passport-github").Strategy;


passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  Users.findById(id, (err, user) => {
    next(err, user);
  });
});

// Local authentication
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

// Github authentication
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
      Users.findOrCreate({ githubId: profile.id, username: profile.username, role: "GUEST" }, (err, user) => {
        return cb(err, user);
      });
    }
  )
);
