const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const passport = require("passport");
const User = require("../models/user");

const ensureLogin = require("connect-ensure-login");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      User.find().then(users => {
        res.render("users", {
          userArray: users,
          message: "You're not entitled to this action."
        });
      });
    }
  };
}

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/login"
  })
);

router.get("/users", ensureLogin.ensureLoggedIn(), (req, res) => {
  User.find()
    .then(users => {
      res.render("users", { userArray: users });
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/users/new", checkRoles("BOSS"), (req, res, next) => {
  res.render("new");
});

router.post("/users/new", checkRoles("BOSS"), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("new", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("new", { message: "The username already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role: role
      });

      newUser.save(err => {
        if (err) {
          res.render("new", { message: "Something went wrong" });
        } else {
          res.redirect("/users");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

router.post("/users/:userId/delete", checkRoles("BOSS"), (req, res, next) => {
  User.findOneAndRemove({ _id: req.params.userId })
    .then(() => {
      res.redirect("/users");
    })
    .catch(error => console.log(error));
});

module.exports = router;
