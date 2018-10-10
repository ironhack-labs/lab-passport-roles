require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const app = express();


//PASSPORT nos traemos el modulo
const passport = require('./helpers/passport')
//SESSION EXPRESS --- para mantener la session
const session = require('express-session')
app.use(session({
  secret: process.env.SECRET, //Viene del .env
  resave: true,
  saveUninitialized: true
}));


mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/roles', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

//PASSPORT - SOLO ESTO SE NECESITA
app.use(passport.initialize());
app.use(passport.session());


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



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
const auth = require('./routes/authRoutes') // ASIGNAMOS AUTH
app.use('/', index);

//Definimos una nueva raiz llamada desde /auth.js
app.use('/auth', auth);


module.exports = app;
