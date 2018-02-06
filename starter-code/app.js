const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const expressLayouts = require('express-ejs-layouts');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const debug = require('debug')(`ibi:${path.basename(__filename).split('.')[0]}`)
const passportConfig = require('./passport')
const {dbURL} = require('./config');

const app = express();

// Controllers
const siteController = require("./routes/siteController");

// Mongoose configuration
mongoose.Promise = global.Promise;
/* mongoose.connect(dbURL, {useMongoClient: true})
  .then(() => debug(`Connected to ${dbURL}`))
  .catch(e => console.log(e)); */
mongoose.connect(dbURL);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout/main-layout');
app.use(expressLayouts);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session cookies
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));
//passport config
passportConfig(app);

//locals
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.title = 'IBI';
  next();
})

// Routes
app.use("/", siteController);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;