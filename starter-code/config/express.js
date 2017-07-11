const express       = require('express');
const mongoose      = require('mongoose');
const path          = require('path');
const favicon       = require('serve-favicon');
const logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');

const siteController = require("../routes/siteController");
const authRoutes = require("../routes/authRoutes");

module.exports = function(){
  const app = express();

  mongoose.connect("mongodb://localhost/ibi-ironhack");


  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');

  app.use(logger('combined'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use("/", siteController);
  app.use("/auth", authRoutes);

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

  return app;
};
