const express = require("express");
const router = express.Router();
const userSchema = require("../models/user.js");
const bcrypt = require("bcrypt");
const passport = require("passport");
const salt = bcrypt.genSaltSync(10);

const adminRole = checkRoles("Boss");
const usersRole = checkRoles(["Boss", "Developer", "TA"]);

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && role.includes(req.user.rol)) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
}

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("auth/ login", { errorMessage: "Error to login" });
});

router.get("/admin", adminRole, (req, res) => {
  userSchema
    .find({})
    .then(user => {
      res.render("auth/admin", { user });
    })
    .catch(err => console.log("An error ocurred finding a user", err));
});

router.get("/users", usersRole, (req, res) => {
  userSchema
    .find({})
    .then(user => {
      res.render("auth/users", { user });
    })
    .catch(err => console.log("An error ocurred finding a user", err));
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/users/:_id", adminRole, (req, res, next) => {
  userSchema
    .findById(req.params._id)
    .then(user => {
      if (user._id === req.params._id) {
        res.render("auth/edituser", { user });
      } else {
        res.render("auth/userid", { user });
      }
    })
    .catch(err => console.log("An error ocurred finding a user", err));
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.post("/admin", adminRole, (req, res, next) => {
  if (req.body.username === "" || req.body.password === "") {
    res.redirect("/admin");
  } else {
    const user = {
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, salt),
      role: req.body.role
    };
    userSchema
      .save(user)
      .then(() => {
        res.redirect("/admin");
      })
      .catch(err => {
        console.log("An error ocurred creating a user", err);
        res.redirect("/users");
      });
  }
});

router.post("/:_id/edit", usersRole, (req, res, next) => {
  const user = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
    role: user.role
  };
  userSchema
    .findByIdAndUpdate(req.params._id, user)
    .then(() => {
      res.redirect("/users");
    })
    .catch(err => console.log("An error ocurred updating a user", err));
});

router.post("/:_id/delete", adminRole, (req, res, next) => {
  userSchema
    .findByIdAndRemove(req.params._id)
    .then(() => {
      res.redirect("/admin");
    })
    .catch(err => console.log("An error ocurred removing a user", err));
});

module.exports = router;
