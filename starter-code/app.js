const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

const passport = require('passport');
const configurePassport = require('./helpers/passport');

const app = express();

// Controllers
const siteController = require('./routes/siteController');
const authRoutes = require('./routes/authRoutes');

// Mongoose configuration
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/ibi-ironhack', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'our-passport-local-strategy-app',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// - passport middleware configuration
configurePassport();// run before passport.initialize
app.use(flash()); //
app.use(passport.initialize());
app.use(passport.session());

// -- middleware after passport init, before routes

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Routes
app.use('/', siteController);
app.use('/', authRoutes);

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
