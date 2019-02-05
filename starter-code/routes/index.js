const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect("/welcome");
    }
  };
}

const checkBoss = checkRoles("Boss");
const checkDeveloper = checkRoles("Developer");
const checkTA = checkRoles("TA");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/welcome", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("welcome", { user: req.user });
});

router.get("/manage-users", checkBoss, (req, res) => {
  User.find({ role: { $ne: "Boss" } })
    .then(users => {
      res.render("manage-users", { users });
    })
    .catch(error => console.log(error));
});

router.post("/add", (req, res) => {
  const { username, password, role } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  const newUser = new User({ username, password: hashPass, role });
  newUser
    .save()
    .then(() => res.redirect("/manage-users"))
    .catch(error => console.log(error));
});

router.get("/delete/:id", (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  User.findByIdAndRemove(req.params.id)
    .then(() => res.redirect("/manage-users"))
    .catch(error => console.log(error));
});

router.get("/list-users", ensureLogin.ensureLoggedIn(), (req, res) => {
  User.find().then(users => {
    res.render("list-users", { users });
  });
});

router.get("/edit-user", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("edit-user", { user: req.user });
});

module.exports = router;
