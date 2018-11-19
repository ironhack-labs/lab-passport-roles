const express = require("express");
const passportRouter = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt=10;
const User = require("../models/user");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");


passportRouter.get("/signup", function(req, res, next) {
  res.render("passport/signup");

});

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;


  if (username === "" || password === "") {
    console.log("ENTRO")
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }
  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
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
        res.render("signup", { message: "Something went wrong" });
      } else {
        res.redirect("login");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

passportRouter.get("/login", function(req, res) {
  res.render("passport/login");
});

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: false,
    passReqToCallback: true
  })
);




passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private-page", { user: req.user });
  }
);

module.exports = passportRouter;