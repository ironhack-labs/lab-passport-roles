const express = require('express');
const router  = express.Router();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require("express-session");
const bcrypt       = require("bcrypt");
const bcryptSalt   = 10;
const passport     = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin  = require("connect-ensure-login");
// const flash        = require("connect-flash");
const Users        = require('../models/User');

function checkRoles(roles) {
  return function (req, res, next) {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    } else {
      res.redirect('/');
    }
  }
};


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post("/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: false,
    passReqToCallback: true
  }));

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private",  { user: req.user });
});

router.get('/home', (req, res, next) => {
  Users.find()
  .then((user) => {
    res.render('home', {user})
  })
});

router.post(('/create-use'), (req, res, next) => {
  Users.findOne({ username: req.body.username })
    .then(userExists => {
      if (userExists) {
        res.json({ alert: "Username already exists" })
      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(req.body.password, salt);

        const newUser = new Users({
          username: req.body.username,
          password: hashPass,
          role: req.body.role
        })

        newUser.save(err => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/home");
          }
        })

      }
    })
    .catch(error => {
      next(error)
    })
});

router.post("/delete/:id", (req, res, next) => {
  Users.findByIdAndRemove({ _id: req.params.id })
    .then(() => {
      res.redirect("/home");
    })
    .catch(() => {
      next();
    });
});

router.get("/user/:id", (req, res, next) => {
  Users.find({ _id: req.params.id })
    .then(userFound => {
      res.render("/home", { userFound });
    })
    .catch(() => {
      next();
    });
});

router.get("/user/:id/edit", (req, res, next) => {
  Users.findById({ _id: req.params.id })
    .then(userToEdit => {
      res.render("/edit", userToEdit);
    })
    .catch(() => {
      next();
    });
});

router.post("/user/:id/", (req, res, next) => {
  Users.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then(() => {
      res.redirect("/home");
    })
    .catch(() => {
      next();
    });
});

module.exports = router;
