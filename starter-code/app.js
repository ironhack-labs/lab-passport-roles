require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require('./models/User.models')
const flash = require("connect-flash");
const session = require("express-session");
const bcrypt = require("bcrypt")
const bcryptSalt = 10




mongoose
  .connect('mongodb://localhost/passport', { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

// app.use(require('node-sass-middleware')({
//   src:  path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   sourceMap: true
// }));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(
  session({ secret: "webmad1019", resave: true, saveUninitialized: true })
)
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
  User.findOne({ username })
    .then(theUser => {
      if (!theUser) return next(null, false, { message: "Nombre de usuario incorrecto" })
      if (!bcrypt.compareSync(password, theUser.password)) return next(null, false, { message: "Contraseña incorrecta" })
      return next(null, theUser);
    })
    .catch(err => next(err))
}))



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



app.use('/', require('./routes/index.route'));
app.use('/login', require('./routes/auth.route'))

module.exports = app;
