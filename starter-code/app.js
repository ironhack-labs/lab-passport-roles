var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
const passport = require("passport")



var app = express();

//connect to database
mongoose.connect("mongodb://localhost:27017/ibi-ironhack");

//importacion de rutas
var index = require('./routes/index');
var users = require('./routes/users');
var courses = require('./routes/courses');
const authRouter = require("./routes/auth");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//se subio el modelo para que las strategys compartan
const User = require("./models/User");


//********************************** passport ****************

//flash for errors
const flash = require("connect-flash");
//session

const session = require("express-session");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local");
//session middleware
app.use(session({
    secret: "alexandra",
    resave: true,
    saveUninitializer: true
}));
//passport session
//before
passport.serializeUser((user,cb)=>{
  cb(null, user._id);
});

passport.deserializeUser((id, cb)=>{
  User.findOne({"_id":id}, (err,user)=>{
    if(err) return cb(err);
    cb(null, user);
  })
});

//flash
app.use(flash());

passport.use(new LocalStrategy({passReqToCallback:true},(req, username, password, next)=>{
  User.findOne({username}, (err, user)=>{
    if(err) return next(err);
    if(!user) return next(null, false, {message: "incorrect username"});
    if(!bcrypt.compareSync(password, user.password)) return next(null, false, {message: "Incorrecto password"});
    return next(null, user);
  });
}));

//after
app.use(passport.initialize());
app.use(passport.session());

//********************************** passport ****************


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//uso de rutas
app.use('/', index);
app.use('/users', users);
app.use("/", authRouter);
app.use("/courses", courses);


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
