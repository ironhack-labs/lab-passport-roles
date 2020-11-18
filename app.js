require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/User.model')
const bcrypt = require('bcrypt')
const flash = require('connect-flash')

mongoose
  .connect('mongodb://localhost/passport-roles', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash())

// MIDDLEWARE PASSPORT CONFIGURATION
app.use(session({
  secret: 'passport-roles',
  resave: true,
  saveUninitialized: true
}))
// SERIALIZE & DESERIALIZE USER
passport.serializeUser((user, cb) => {
  cb(null, user._id)
})
passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => {
      cb(null, user)
    })
    .catch(err => {
      return cb(err)
    })
})
// SET STRATEGY

passport.use(new LocalStrategy({passReqToCallback: true}, (req, username, password, next) => {
  User.findOne({ username })
    .then(user => {
      if(user){
        bcrypt.compare(password, user.password)
          .then(response => {
            if(!response){
              next(null, false, {message: 'Incorrect username or password'})
            }else {
              next(null, user)
            }
          })
      }else {
        next(null, false, {message: 'Incorrect username or password'})
      }
    })
    .catch(err => {
      console.error(err)
      next(err)
    })
}))
app.use(passport.initialize())
app.use(passport.session())


// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
hbs.registerPartials(__dirname + '/views/partials')

// default value for title local
// app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index.routes');
app.use('/', index);
const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);
const usersRoutes = require('./routes/users.routes');
app.use('/users', usersRoutes);
const employeesRoutes = require('./routes/employees.routes')
app.use('/employees', employeesRoutes)

module.exports = app;
