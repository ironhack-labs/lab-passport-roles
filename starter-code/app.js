const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const User = require('./models/user');
const flash = require("connect-flash");
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");


const app = express();

// Controllers
const siteController = require("./routes/siteController");
const adminController = require('./routes/adminController');
const profilesController = require('./routes/profilesController');
const courseController = require('./routes/courseController');

// Mongoose configuration
mongoose.connect("mongodb://localhost/ibi-ironhack");

app.use(session({
  secret: "passport-roles",
  resave: true,
  saveUninitialized: true
}));

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

// passport.use(new FbStrategy({
//   clientID: "369918540102379",
//   clientSecret: "f5779f17cea6d28b343be82f20ac98e6",
//   callbackURL: "/auth/facebook/callback"
// }, (accessToken, refreshToken, profile, done) => {
//   User.findOne({ facebookID: profile.id }, (err, user) => {
//     if (err) {
//       return done(err);
//     }
//     if (user) {
//       return done(null, user);
//     }
//
//     const newUser = new User({
//       facebookID: profile.id
//     });
//
//     newUser.save((err) => {
//       if (err) {
//         return done(err);
//       }
//       done(null, newUser);
//     });
//   });
//
// }));


//initialize passport and session here

app.use(passport.initialize());
app.use(passport.session());

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

// Routes
// PREGUNTA: MIDDLEWARES SE EJECUTA EL MIDDLEWARE AQUI AUNQUE NO NO CORRESPONDA,
// PONER MIDELWARRE DENTRO CON USE O DENTRO PARA TODAS LAS RUTA EN GET?
app.use("/", siteController);

app.use("/profile", ensureLogin.ensureLoggedIn(), profilesController);
app.use('/', ensureLogin.ensureLoggedIn(), adminController);
app.use('/courses', courseController);


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
