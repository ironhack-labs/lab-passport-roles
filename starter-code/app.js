const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require("mongoose");

const app = express();

// Controllers
const siteController = require("./routes/siteController");
const login = require("./routes/login");
const private = require("./routes/private");
const employees = require("./routes/employees");
const courses = require("./routes/courses");
const students = require("./routes/students");

// Mongoose configuration
mongoose.connect("mongodb://localhost/ibi-ironhack");

const User = require("./models/user");
const session = require("express-session");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");
const passport = require('./helpers/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//initialize passport and session here
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true,
  rolling: true,
  cookie: { maxAge: 60000 },
}));

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", siteController);
app.use("/login", login);
app.use("/employees", employees);
app.use("/private", private);
app.use("/courses", courses);
app.use("/students", students);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
