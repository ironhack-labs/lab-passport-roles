require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session = require("express-session")
const bcrypt = require("bcrypt")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const flash = require("connect-flash")    // Error handling

const Empl = require('./models/empl.model')



mongoose
  .connect('mongodb://localhost/passport-roles', {useNewUrlParser: true,useUnifiedTopology: true})
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
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Express-session
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}))

// Configurar serialización y deserialización de usuario:
passport.serializeUser((user, cb) => cb(null, user._id))
passport.deserializeUser((id, cb) => {
  Empl.findById(id, (err, user) => {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

//Confi estrategia
app.use(flash())    // Error handling
passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
  Empl.findOne({ username })
    .then(theUser => {
      if (!theUser) return next(null, false, { message: "Nombre de usuario incorrecto" })
      if (!bcrypt.compareSync(password, theUser.password)) return next(null, false, { message: "Contraseña incorrecta" })
      return next(null, theUser);
    })
    .catch(err => next(err))
}))

// * Inicializar tanto `passport` como `passport session`:
app.use(passport.initialize())
app.use(passport.session())

// default value for title local
app.locals.title = 'Passport-Role-lab by er Miguelito';



const index = require('./routes/index.routes');
app.use('/', index);
app.use('/', require('./routes/auth.routes'));
app.use('/', require('./routes/roles.routes'));


module.exports = app;
