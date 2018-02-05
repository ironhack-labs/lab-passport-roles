const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const FbStrategy = require('passport-facebook').Strategy;

const User = require('./models/user');

// Controllers
const index = require('./routes/index');
const authRoutes = require('./routes/auth-routes');

// Mongoose configuration
mongoose.connect('mongodb://localhost/passport-auth', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

// Middlewares configuration
app.use(logger('dev'));

// View engine configuration
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('layout', 'layouts/main');

// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Authentication / Session
app.use(cookieParser());

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    }),
    secret: 'foobar',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

passport.use(
  new FbStrategy(
    {
      clientID: '141972969833279',
      clientSecret: '09fd0b6c08e52543320164e4421765d6',
      callbackURL: '/auth/facebook/callback'
    },
    (accessToken, refreshToken, profile, done) => {
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

        newUser.save(err => {
          if (err) {
            return done(err);
          }
          done(null, newUser);
        });
      });
    }
  )
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', index);
app.use('/', authRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404);
  const data = {
    title: '404 Not Found'
  };
  res.render('not-found', data);
});

app.use((err, req, res, next) => {
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
