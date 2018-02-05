
const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require("mongoose");
const passport     = require('passport');
const flash        = require('connect-flash');
const session      = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const MongoStore   = require('connect-mongo')(session);

const app = express();

// Controllers
const siteController    = require("./routes/siteController");
const configurePassport = require('./helpers/passport');
const user              = require('./models/user');  

// Mongoose configuration
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/ibi-ironhack",{
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/", siteController);

//Layout
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.set('views', __dirname + '/views');

//Passport
configurePassport();
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Session
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(function (req, res, next) {
  app.locals.user = req.user;
  next();
});

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
