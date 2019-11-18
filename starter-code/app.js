require('dotenv').config();


const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");
const flash = require("connect-flash");
const Swag = require("swag");
Swag.registerHelpers(hbs);
const User = require("./models/Users");
const app = express();
const session = require("express-session");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


mongoose
  .connect('mongodb://localhost/LocalRoles', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

 

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);



// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: "our-passport-local-strategy-app",
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash());

// Express View engine setup

// app.use(require('node-sass-middleware')({
//   src:  path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   sourceMap: true
// }));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
hbs.registerPartials(__dirname + "/views/partials");



// default value for title local
app.locals.title = 'Local-Roles';



// const index = require('./routes/index');
// app.use('/', index);

passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true
    },
    (req, username, password, next) => {
      User.findOne(
        {
          username
        },
        (err, user) => {
          // todo: watch with mongodb stopped
          if (err) {
            return next(err);
          }

          if (!user) {
            return next(null, false, {
              message: "Incorrect username"
            });
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, {
              message: "Incorrect password"
            });
          }

          return next(null, user);
        }
      );
    }
  )
);

passport.serializeUser((user, cb) => {
  console.log("serialize");
  console.log(`storing ${user._id} in the session`);
  cb(null, user._id);
});
passport.deserializeUser((id, cb) => {
  console.log("deserialize");
  console.log(`Attaching ${id} to req.user`);
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.get("/", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("base", {
    user: req.user,
    section: "index"
  });
});

app.get("/signup", (req, res) => {
  res.render("base", {
    section: "signup"
  });
});

app.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("base", {
      message: "Indicate username and password",
      section: "signup"
    });
    return;
  }

  User.findOne({
    username
  })
    .then((user) => {
      if (user !== null) {
        res.render("base", {
          message: "The username already exists",
          section: "signup"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save((err) => {
        if (err) {
          res.render("base", {
            message: "Something went wrong",
            section: "signup"
          });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/login", (req, res) => {
  res.render("base", {
    message: req.flash("error"),
    section: "login"
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);
function checkRoles(roles) {
  // eslint-disable-next-line
  return function(req, res, next) {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    } else {
      if (req.isAuthenticated()) {
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    }
  };
}

// js curry
const checkAdminOrEditor = checkRoles(["BOSS", "TA"]);
const checkAdmin = checkRoles(["BOSS"]);

app.get("/private-page-admin-editors", checkAdminOrEditor, (req, res) => {
  res.render("onlyforadminseditors", {
    user: req.user,
    section: "private"
  });
});

app.get("/private-page-admin", checkAdmin, (req, res) => {
  res.render("onlyforadmins", {
    user: req.user,
    section: "private"
  });
});

app.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("base", {
    user: req.user,
    section: "private"
  });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = app;
