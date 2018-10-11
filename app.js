require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require(`express-session`);


mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/security', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Session
app
  .use( session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  }) )
;

// Passport import/config
const passport = require(`./helpers/passport`);
app
  .use(passport.initialize())
  .use(passport.session())
;

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

hbs.registerPartials(`${__dirname}/views/partials`);

// Routes
const
  siteRoutes = require(`./routes/siteRoutes`),
  authRoutes = require(`./routes/auth/authRoutes`)
;
app
  .use('/', siteRoutes)
  .use(`/auth`, authRoutes)
;


module.exports = app;
