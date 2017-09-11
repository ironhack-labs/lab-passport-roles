const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require('passport');



const app = express();

// Controllers
const router = require("./routes/auth.js");
const employee = require("./routes/employee.js");



// Mongoose configuration
mongoose.connect("mongodb://localhost/ibi-ironhack",{useMongoClient:true})
        .then(()=> debug("connected to db!"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

require('./passport/serializers');
require('./passport/local');

app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/", router);
app.use("/employee", employee)


















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
