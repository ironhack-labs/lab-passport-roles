const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt")
const ensureLogin = require("connect-ensure-login");
const passport = require("passport")
const userModel = require("../models/User")
const encriptPassword = bcrypt.encriptPassword;
const checkPassword = bcrypt.checkPassword;
const LocalStrategy = require("passport-local").Strategy;


passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  userModel.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

passport.use(
  new LocalStrategy((username, password, next) => {
    userModel.findOne({ username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect username" });
      }
      if (!checkPassword(password, user.password)) {
        return next(null, false, { message: "Incorrect password" });
      }

      return next(null, user);
    });
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "passport/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/login", (req, res, next) => {
  res.render("passport/login", {
    message: req.flash("error")
  });
});

router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

router.post("/signup", (req, res, next) => {
  if (req.body.username === "" || req.body.password === "") {
    res.render("passport/signup", {
      errorMessage: "Please fill the fields"
    });
    return;
  }
  userModel
    .findOne({ username: req.body.username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", {
          errorMessage: "That username is already taken"
        });
        return;
      }
      userModel
        .create({
          username: req.body.username,
          password: encriptPassword(req.body.password)
        })
        .then(user => {
          console.log(`${user.username} was saved in the database`);
          res.redirect("/");
        })
        .catch(err => `An error occurred to save the user: ${err}`);
    })
    .catch(err => `An error occured trying to find the user ${err}`);
});

router.post("/login", (req, res, next) => {});


module.exports = router;
