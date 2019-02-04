const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const User = require("../models/role");
const bcrypt = require("bcryptjs");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/login", (req, res, next) => {
  res.render("../views/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    passReqToCallback: true
  })
);

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("../views/private", { user: req.user });
});

router.get("/signup", (req, res, next) => {
  res.render("../views/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({
    username
  })
    .then(user => {
      if (user !== null) {
        throw new error("Username already Exists");
      }
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      return newUser.save();
    })
    .then(() => {
      res.redirect("/private");
    })
    .catch(err => {
      res.render("/signup"),
        {
          errorMessage: err.message
        };
    });
});

router.post('/private/:id/delete', (req, res, next) => {
  User.findByIdAndRemove(req.params._id)
      .then(() => {
        res.redirect('/private/')
      })
      .catch(err => {
        console.log(err);
        next();
  });
})

router.get("/allUsers", ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log("Hola gilii");
  User.find().then(user => {
    res.render("allUsers", { user: req.user });
  });
});

module.exports = router;
