const express = require('express');
const path = require('path');
const logger = require('morgan');
const favicon = require('serve-favicon');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
mongoose.Promise = require('bluebird');

const app = express();

mongoose.connect('mongodb://localhost:27017/ibi-ironhack')
  .then(() => console.log('connection succesfully to MongoDB'))
  .catch(err => console.error(err));

// Require Helper files
const passport = require('./helpers/passport');
const auth = require('./helpers/auth');

// Require the Routes
const siteRoutes = require('./routes/siteRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

// view engine setup & Layout Settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');

// app.use(favicon(`${__dirname}/public/images/database-icon.png`));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(expressLayouts);
app.use(session({
  secret: 'IBI-rocks-2017',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 },
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// adding our own middleware so all pages can access currentUser
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// app.use(auth.setCurrentUser);

// Routes
app.use('/', authRoutes);
app.use('/', siteRoutes);
app.use('/admin', adminRoutes);
app.use('/users', userRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// adding our own middleware so all pages can access currentUser
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
