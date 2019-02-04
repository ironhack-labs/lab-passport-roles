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
const LocalStrategy = require('passport-local').Strategy;
const User         = require("./models/role")
const bcrypt       = require("bcryptjs");
const session      = require("express-session")

mongoose
  .connect('mongodb://localhost/roleUsers', {useNewUrlParser: true})
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

app.use(session({
  secret:"our-passport",
  resave: true,
  saveUninitialized: true
}))

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

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  cb(null, user._id);
} )

passport.deserializeUser((id, cbo) => {
  User.findById (id, (err, user) =>{
    if (err){
      return cb(err)
    }
    cbo (null, user)
    })
})

passport.use(new LocalStrategy((username, password, next) => {

  User.findOne({username})
  .then( user =>{
    console.log(bcrypt.compareSync(password, user.password))
      if (!user){
        throw new Error("Incorrect Username");
      } 
      if (!bcrypt.compareSync(password, user.password)){
        throw new Error("Incorrect Password");
      } 
      return next(null, user);
  })
  .catch(e => {
      next(null, false, {
          message: e.message
      })
  })
}));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);


module.exports = app;
