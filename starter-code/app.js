require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const passport     = require("passport");
const ensureLogin = require("connect-ensure-login");
const bcrypt = require("bcrypt");
const session = require("express-session");
const app = express()



mongoose
  .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'IRONCOMPANY';



const index = require('./routes/index');
app.use('/', index);

function checkRoles(roles) {
	return function (req, res, next) {
		if (req.isAuthenticated() && roles.includes(req.user.role)) {
			return next();
		} else {
			if (req.isAuthenticated()) {
				res.redirect('/')
			}	else {
				res.redirect('/login')
			}
		}
	}
}

// js curry
const checkBoss = checkRoles(['BOSS']);


app.get("/private-createUsers-boss", checkAdmin, (req, res) => {
	res.render("onlyforboss", {
		user: req.user,
		"section": "private"
	});
});

app.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
	res.render("base", {
		user: req.user,
		"section": "private"
	});
});


module.exports = app;
