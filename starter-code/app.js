const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require("mongoose");
const session = require("express-session");
const bcrypt = require('bcrypt');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const User = require("./models/user");
const app = express();
const FbStrategy = require('passport-facebook').Strategy;

// passport initialize
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
passport.use(new FbStrategy({
    clientID: "924679584346537",
    clientSecret: "5329b30abb93b0af3e3fbfd2d1a3ce4f",
    callbackURL: "/auth/facebook/callback"
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({
          username: profile.displayName
        }, (err, user) => {
          if (err) {
            return done(err);    }
    if (user) {
      return done(null, user);
    }

    const newUser = new User({
      username: profile.displayName,
      name: profile.displayName,
      familyName: profile.name.familyName,
      role: 'Student'
    });
    console.log(newUser);
    newUser.save((err) => {
      if (err) {
        return done(err);
      }
      done(null, newUser);
    });
  });

}));
//enable sessions here
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));
//initialize passport and session here
app.use(passport.initialize());
app.use(passport.session());

// Controllers
const siteController = require("./routes/siteController");
const portal = require("./routes/portal");
const courses = require("./routes/courses");
const admin = require("./routes/employees");
// Mongoose configuration
mongoose.connect("mongodb://localhost/ibi-ironhack");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/", siteController);
app.use("/portal", portal);
app.use("/portal/courses", courses);
app.use("/portal/admin", admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
