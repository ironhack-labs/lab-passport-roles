require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const passport     = require('passport');
// const flash        = require('flash');
const session =     require("express-session");


// const bcrypt = require('bcrypt');
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/User');


const courses = require('./routes/courses');
const index = require('./routes/index');
const users = require('./routes/users');



mongoose
  .connect('mongodb://localhost/alumhack', {useNewUrlParser: true})
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


// app.use(flash());
app.use(
 session({
   secret: "our-passport-local-strategy-app",
   resave: true,
   saveUninitialized: true
 })
);

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



// default value for title local
app.locals.title = 'ALUMHACK FINAL EDITION MASTER CHALLENGE';




passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true
    },
    (req, username, password, next) => {
      User.findOne(
        {
          username
        },
        (err, user) => {
          // todo: watch with mongodb stopped
          if (err) {
            return next(err);
          }

          if (!user) {
            return next(null, false, {
              // message: "Incorrect username"
            });
          }

          //en este if iria !bcrypt.compareSync
          if (password != user.password) {
            console.log(password, user.password)
            return next(null, false, {
              // message: "Incorrect password"
            });
          }

          return next(null, user);
        }
      );
    }
  )
);

passport.serializeUser((user, cb) => {
  console.log("serialize");
  console.log(`storing ${user._id} in the session`);
  cb(null, user._id);
  // cb(null, {id: user._id, role: user.role});
});


app.use(passport.initialize());
app.use(passport.session());


passport.deserializeUser((id, cb) => {
  console.log("deserialize");
  console.log(`Attaching ${id} to req.user`);
  // eslint-disable-next-line consistent-return
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

// Middleware Setup 2
app.use('/', index);
app.use('/users', users);
app.use('/courses', courses);

module.exports = app;
