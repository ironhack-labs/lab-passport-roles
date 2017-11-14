const express        = require('express');
const expressLayouts = require('express-ejs-layouts');
const path           = require('path');
const favicon        = require('serve-favicon');
const logger         = require('morgan');
const cookieParser   = require('cookie-parser');
const bodyParser     = require('body-parser');
const session        = require('express-session');
const User           = require('./models/User');
const passport       = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const bcrypt         = require('bcrypt');
const debug          = require('debug')('ibi-ironhack:'+ path.basename(__filename));
const app            = express();

// Controllers
const siteController = require("./routes/siteController");

// Mongoose configuration
const mongoose       = require("mongoose");
const databaseURL    = "mongodb://localhost/ibi-ironhack";
mongoose.connect(databaseURL, {useMongoClient: true}, () => debug(`Connected to db: ${databaseURL}`));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session ({
  secret: "ironhack-ibi",
  resave: true,
  saveUninitialized: true
}));

// Passport functions and strategies
// Functions
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Strategies
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

// Middlewares
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/", siteController);

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
