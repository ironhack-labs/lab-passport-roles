const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const FbStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
// const MongoStore = require('connect-mongo')(session);

// const auth = require('./routes/auth');

const app = express();

// Controllers
const siteController = require('./routes/siteController');

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
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// -- session

// app.use(session({
//   store: new MongoStore({
//     mongooseConnection: mongoose.connection,
//     ttl: 24 * 60 * 60 // 1 day
//   }),
//   secret: 'foobar',
//   resave: true,
//   saveUninitialized: true,
//   cookie: {
//     maxAge: 24 * 60 * 60 * 1000
//   }
// }));

// app.use(function (req, res, next) {
//   app.locals.user = req.session.currentUser;
//   next();
// });

// Passport

passport.use(new FbStrategy({
  clientID: 180342055902385,
  clientSecret: '558c1eb6b4e53ae1c45a0f916b7f8b41',
  callbackURL: '/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ facebookID: profile.id }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    }

    const newUser = new User({
      facebookID: profile.id
    });

    newUser.save((err) => {
      if (err) {
        return done(err);
      }
      done(null, newUser);
    });
  });
}));

authRoutes.get('/auth/facebook', passport.authenticate('facebook'));
authRoutes.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/private-page',
  failureRedirect: '/'
}));

// Routes
app.use('/', siteController);
// app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// -- error handlers

app.use(function (req, res, next) {
  res.status(404);
  const data = {
    title: '404 Not Found'
  };
  res.render('not-found', data);
});

app.use(function (err, req, res, next) {
  console.error('ERROR', req.method, req.path, err);
  if (!res.headersSent) {
    const data = {
      title: '500 Ouch'
    };
    res.status(500);
    res.render('error', data);
  }
});

module.exports = app;
