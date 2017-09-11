const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require("mongoose");
const ejs = require('ejs');
const expressLayouts  = require('express-ejs-layouts');
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const ensureLogin = require("connect-ensure-login")
const FbStrategy = require('passport-facebook').Strategy;

const app = express();

// Controllers
const siteController = require("./routes/siteController");
const indexController = require("./routes/index/indexController");
const profileController = require("./routes/profile/profileController");
const powersController = require("./routes/powers/powersController");

// Mongoose configuration
mongoose.connect("mongodb://localhost/ibi-ironhack", {useMongoClient: true});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passportJS to manage authentication

const User = require("./models/users");

app.use(session({
  secret: 'ibi-ironhack',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(flash());

passport.use(new LocalStrategy(
  (username, password, done) => {
    passReqToCallback: true
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}
));

passport.use(new FbStrategy({
    clientID: "1929559973727863",
    clientSecret: "a7981f15f9daca04beb33277594c97a1",
    callbackURL: "/auth/facebook/callback"
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookID: profile.id }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, user);
      }

      const newUser = new User({
        facebookID: profile.id,
        username: profile.displayName.split(' ').join('').toLowerCase() + Math.floor((Math.random() * 10000000)),
        firstName: (profile.displayName.split(' '))[0],
        lastName: (profile.displayName.split(' '))[1]
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
app.use("/index", indexController);
app.use("/powers", powersController);
app.use("/profile", profileController)

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
  if (res.headerSent) { 
    res.status(err.status || 500);
    res.render('error');
    console.error();
  }
});

module.exports = app;
