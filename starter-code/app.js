const express = require('express');
const path = require('path');
const User = require('./models/User');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const debug = require('debug')('lab-passport:server');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// CONTROLLERS
const siteController = require('./routes/siteController');
const usersController = require('./routes/users');
const coursesController = require('./routes/courses');


// MONGOOSE CONFIG
const dbURL = 'mongodb://localhost/ibi-ironhack';
mongoose.connect(dbURL).then(() => debug(`Connected to ${dbURL}`));

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'ironhack-ibi',
  resave: false,
  saveUninitialized: true,
  store: new mongoStore( { mongooseConnection: mongoose.connection })
}));

// PASSPORT CONFIG
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ '_id': id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// STRATEGIES
passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: 'Incorrect username' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: 'Incorrect password' });
    }
    return next(null, user);
  });
}));

// MIDDLEWARES
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use('/', siteController);
app.use('/', usersController);
app.use('/', coursesController);

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
