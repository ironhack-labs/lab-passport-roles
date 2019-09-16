require("dotenv").config();

// const hbs          = require('hbs');
// const mongoose     = require('mongoose');

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const pug = require("pug");
const logger = require("morgan");
const path = require("path");
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

// Database connection
require("./configs/db.config");

// Passport configuration
require("./configs/passport.config")

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);
const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'webdev',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Express View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

const index = require("./routes/index");
app.use("/", index);

module.exports = app;
