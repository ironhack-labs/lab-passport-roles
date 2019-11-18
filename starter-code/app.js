require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const passport     = require('passport');
const localStrat   = require('passport-local').Strategy;
const bcrypt       = require('bcrypt');
const bcryptSalt   = 10;
const session      = require('express-session');
const ensureLogin  = require('connect-ensure-login');
const flash        = require('connect-flash');
 
const Users        = require('./models/User')

mongoose
  .connect('mongodb://localhost/rolesLab', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Something about the session?
app.use(
  session({
    secret: "this-random-string-is-used-by-express-session",
    resave: true,
    saveUninitialized: true
  })
);

// Volatil passport error login messages
app.use(flash());


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

// Body parser makes accesible the req.body content
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// default value for title local
app.locals.title = 'Ironhack Bureau Investigation';


// Passport config
passport.use(
  new localStrat(
    {
      passReqToCallback: true
    },
    (req, username, password, next) => {
      Users
      .findOne({username}, (err, user) => {
        if (err) {
          return next(err);
        }

        if(!user) {
          return next(null, false, {
            message : "Incorrect username"
          });
        }

        if(!bcrypt.compareSync(password, user.password)){
          return next(null, false, {
            message: "Incorrect password"
          });
        } 

        return next(null, user);

      });
    }
  )
)


passport.serializeUser((user, cb) => {
  cb(null, user._id);
})

passport.deserializeUser((id, cb) => {
  Users.findById(id, (err, user) => {
    if(err) {
      return cb(err);
    }
    cb(null, user);
  })
})

app.use(passport.initialize());
app.use(passport.session());

// Routes config
const index = require('./routes/index');
app.use('/', index);


module.exports = app;
