const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  //res.redirect('login');
   res.render('login');
});

/* GET Login */
// router.get('/login', (req, res, next) => {
//   res.render('login');
// });


//Aquí viene la fusilada
// const express = require("express");
const app = express();
const session = require("express-session");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const hbs = require("hbs");
const Swag = require("swag");
Swag.registerHelpers(hbs);

const User = require("../models/user");

mongoose
  .connect("mongodb://localhost/ironhackers")
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

app.use(
  session({
    secret: "our-passport-local-strategy-app",
    resave: true,
    saveUninitialized: true
  })
);

app.use(flash());

app.use(express.static(path.join(__dirname, "/public")));
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

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
  // cb(null, {id: user._id, role: user.role});
});


passport.deserializeUser((id, cb) => {
  console.log("deserialize");
  console.log(`Attaching ${id} to req.user`);
  // eslint-disable-next-line consistent-return
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



/* GET Logged people */
// app.get("/login", (req, res) => {
//   res.render('/loginresult');
//  });

// app.post("/loginresult", (req, res, next) => {
app.get("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("loginresult", {
      message: "Indicate username and password",
      section: "signup"
    });
    return;
  }

  User.findOne({
    username
  })
    .then(user => {
      if (user !== null) {
        res.render("loginresult", {
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

      newUser.save(err => {
        if (err) {
          res.render("loginresult", {
            message: "Something went wrong",
            section: "signup"
          });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

app.get("/login", (req, res) => {
  res.render("loginresult", {
    message: req.flash("error"),
    section: "login"
  });
});

// invoked via passport.use(new LocalStrategy({
app.post(
  "/loginresult",
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
const checkAdminOrEditor = checkRoles(["Developer", "TA"]);
const checkAdmin = checkRoles(["Boss"]);

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
  console.log(req.user.password);
  console.log("req.session.passport***********");
  console.log(req.session.passport);

  res.render("base", {
    user: req.user,
    section: "private"
  });
});

/*
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

app.get("/remember", (req, res) => {
  res.render("remember");
});

app.post("/remember-password", (req, res) => {
  console.log(`find in mongo the user with email ${req.body.email}`);
});
*/

module.exports = router;
