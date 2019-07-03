require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; //this is a class within the module
const FacebookStrategy = require("passport-facebook").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const flash = require('connect-flash');
const User = require("./models/user");

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://127.0.0.1/passport-roles', { useNewUrlParser: true})
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  }).catch(err => {
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

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 24*60*60 },
  resave: true,
  saveUninitialized: true
}));

app.use(flash());
passport.serializeUser((user, next) => {
  next(null, user._id);
});

passport.deserializeUser((id, next) => {
  User.findById(id).then(user => { 
    next(null, user); 
  })
  .catch(err => {
    next(err)
  });
});

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username })
  .then(user => {
    if (!user || !bcrypt.compareSync(password, user.password)) { 
      return next(null/* no error */, false/* no user */, { message: "Invalid credentials" }); 
    }
    return next(null, user);
  })
  .catch(err => next(err));
}));


passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
}, (accessToken, refreshToken, profile, next) => {
  console.log(profile);
  User.findOne({facebookId: profile.id}).then(user => {
    if (user) return next(null, user);
    return User.create({facebookId: profile.id}).then(user => {
      return next(null, user);
    })
  }).catch(error => console.log(error));
}
));


passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_APP_ID,
  clientSecret: process.env.GITHUB_APP_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/github/callback"
}, (accessToken, refreshToken, profile, next) => {
  console.log(profile);
  User.findOne({githubId: profile.id}).then(user => {
    if (user) return next(null, user);
    return User.create({githubId: profile.id}).then(user => {
      return next(null, user);
    })
  }).catch(error => console.log(error));
}
));

app.use(passport.initialize());
app.use(passport.session());

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
hbs.registerPartials(__dirname + '/views/partials');



// default value for title local
app.locals.title = 'Passport Roles Lab';



const index = require('./routes/index');
const protected = require('./routes/protected');
const authRoutes = require("./routes/auth-routes");

app.use('/', index);
app.use('/', authRoutes);
app.use('/', protected);


module.exports = app;
