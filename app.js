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
const session = require('express-session');
const passport = require('passport');

//require configs
require("./configs/db.config");
require("./configs/hbs.config");
require('./configs/passport.config').setup(passport);//le paso passport al setup
require("./configs/session.config")(app);

//set up passport
app.use(passport.initialize()); //2. INITIALISE, INVOKED IN EACH REQUEST, check if there is passport.user, may be empty
app.use(passport.session()); //3. CARGA el user object en req.user si hay un user serialised en el servidor, ir a controller

//requiring routes
const usersRouter = require("./routes/users.routes");
const sessionsRouter = require("./routes/sessions.routes");
const coursesRouter = require('./routes/courses.routes');
const helpRouter = require('./routes/help.routes');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// Middleware Setup logs and parse body and cookies
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//set views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//set locals
app.use((req, res, next) =>{
  res.locals.passportSession = req.user;//passport session user PASSPORT
  res.locals.title = 'Welcome to my website';
  res.locals.usuarios = 'Users:';
  // res.locals.message = 'we have sent you an email to verify account';
  next();
});

//main routes
app.use("/users", usersRouter);
app.use("/sessions", sessionsRouter);
app.use("/courses", coursesRouter);
app.use("/help", helpRouter);
app.use("/", usersRouter);

//errors locals
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//export app
module.exports = app;
