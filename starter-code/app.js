'use strict'

const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require("mongoose");
const expressLayouts = require('express-ejs-layouts');

// Require passport settings 
const passport = require('passport');
const session = require("express-session");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
// const FbStrategy = require('passport-facebook').Strategy;

const app = express();

// Controllers
const authRoutes = require("./routes/auth-routes");
const index = require("./routes/index");


// Mongoose configuration
mongoose.connect("mongodb://localhost/ibi-ironhack");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

// Passport local configuration
app.use(session({
  secret: "8475384939",
  resave: true,
  saveUninitialized: true
}));

// Passeport strategy (user serialize, deserialize)
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy((username, password, next) => {
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
}));

// Initialize passport and passport session
app.use(passport.initialize());
app.use(passport.session());

// Passport FB configuration
// passport.use(new FbStrategy({
//   clientID: "1583708408362208",
//   clientSecret: "1678bd24d3fb63d9be489db2492a0bd5",
//   callbackURL: "/auth/facebook/callback"
// }, (accessToken, refreshToken, profile, done) => {
//   User.findOne({ facebookID: profile.id }, (err, user) => {
//     if (err) {
//       return done(err);
//     }
//     if (user) {
//       return done(null, user);
//     }

//     const newUser = new User({
//       facebookID: profile.id
//     });

//     newUser.save((err) => {
//       if (err) {
//         return done(err);
//       }
//       done(null, newUser);
//     });
//   });

// }));


// Routes
app.use("/", index);
app.use("/auth", authRoutes);


// -- 404 and error handler

// NOTE: requires a views/not-found.ejs template
app.use(function (req, res, next) {
  res.status(404);
  res.render('not-found');
});

// NOTE: requires a views/error.ejs template
app.use(function (err, req, res, next) {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

module.exports = app;
