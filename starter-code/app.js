const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const saltRounds = 15
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

const User = require('./models/users')



const app = express();

// Controllers
const siteController = require("./routes/siteController");

// Mongoose configuration
mongoose.connect("mongodb://localhost/ibi-ironhack");

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

// SESSION INIT
app.use(session({
	secret: "poop",
	resave: true,
	saveUninitialized: true
}));

app.use(flash());

//PASSPORT INIT 
passport.serializeUser((user, cb) => {
	cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
	User.findOne({ "_id": id }, (err, user) => {
		if (err) { return cb(err); }
		cb(null, user);
	});
});

passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
	User.findOne({ username }, (err, user) => {
		if (err) {
			return next(err)
		};
		if (!user || !bcrypt.compareSync(password, user.password)) {
			return next(null, false, { message: "Incorrect username/password combination" });
		}
		return next(null, user);
	});
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", siteController);

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