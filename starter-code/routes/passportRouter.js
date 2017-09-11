const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user").user;
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("signup", { message: "The username already exists" });
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
        res.redirect("/");
      }
    });
  });
});

router.get("/", (req, res, next) => {
  res.render("index", {"message": req.flash("error")});
});

router.post("/", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

module.exports = {passport: router};
