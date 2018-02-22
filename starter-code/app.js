const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require("mongoose");
const User = require("./models/user");
const Student = require("./models/student");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const FbStrategy = require('passport-facebook').Strategy;

const app = express();

// Controllers
const siteController = require("./routes/siteController");
const users = require("./routes/users");
const courses = require("./routes/courses");
const students = require("./routes/students");

// Mongoose configuration
mongoose.connect("mongodb://localhost/ibi-ironhack");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());


//Session
app.use(session({
  secret: "IBI",
  resave: true, 
  saveUninitialized: true
}));

//Initialize Passport and Session
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb)=> {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({"_id": id}, (err, user) => {
    if (err) {return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy({passReqToCallback: true}, (req, username, password, next)=>{
      User.findOne({username}, (err, user)=>{
          if (err) {
            return next(err);
          }
          if (!user) {
            return next(null, false, {message: "Incorrect username"})
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, {message: "Incorrect password"})
          }

          return next(null, user)
      });
}));

passport.use(new FbStrategy({
  clientID: "375844716215268",
  clientSecret: "012c2abc0ba4cec0b4ccb35aeefe0396",
  callbackURL: "/auth/facebook/callback",
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ facebookID: profile.id }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      console.log(profile)
      return done(null, user);
    }
    
    const newUser = new User({
      facebookID: profile.id,
      username: profile.displayName,
      name: profile.displayName,
      role: "Student"
    });

    newUser.save((err) => {
      if (err) {
        return done(err);
      }
      done(null, newUser);
    });
  });

}));

// Routes
app.use("/", siteController);
app.use("/users", users);
app.use("/courses", courses);
app.use("/students", students);

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
