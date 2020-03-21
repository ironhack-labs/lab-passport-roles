const express = require("express");
const passportRouter = express.Router();

// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
// Add ensureLogin
const ensureLogin = require("connect-ensure-login").ensureLoggedIn;

// Add passport
const passport = require("passport");

// Add our checkRoles middleware
const checkRoles = require("../auth/checkRoles")

//// Routes

// Get overview of all the users
passportRouter.get("/employees", checkRoles("BOSS"), (req, res, next) => {
  User.find({})
    .then(user => {
      res.render("passport/employees", { user });
    })
    .catch(e => next(e));
});

// Edit user
passportRouter.get("/editemployee/:id", checkRoles("BOSS"), (req, res, next) => {
  const {id} = req.params.id;
  User.findOne({id})
    .then(user => {
      console.log(user)
      res.render("passport/editEmployee", { user, role: user.role });
    })
    .catch(e => next(e));
});

passportRouter.post("/editemployee/:id", checkRoles("BOSS"), (req, res, next) => {
  const {username, role} = req.body;
  User.UpdateOne({ _id: req.params.id }, {$set: {username, role}})
    .then(user => {
      console.log(user);
      res.render("passport/employees");
    })
    .catch(e => next(e));
});


// Add a new user
passportRouter.get("/addemployee", ensureLogin("/login"), (req, res, next) => {
  res.render("passport/addEmployee", { message: req.flash("error") });
});


passportRouter.post("/addemployee", ensureLogin("/login"), (req, res, next) => {
  const { username, password, role } = req.body;
  if (username === "" || password === "") {
    req.flash("error", "Fields cannot be blank");
    res.redirect("/addemployee");
    throw "Empty details entered";
  }
  User.findOne({ username: username })
    .then(user => {
      if (user) {
        req.flash("error", "Username already exists");
        res.redirect("/addemployee");
        throw "Username already exists";
      }
    })
    .then(() => {
      bcrypt.hash(password, 10).then(hash => {
        return User.create({
          username: username,
          password: hash,
          role: role
        }).then(user => {
          res.redirect("/employees", { user });
        });
      });
    });
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login", { message: req.flash("error") });
});

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/employees",
    failureRedirect: "/login",
    failureFlash: true
  })
);

// passportRouter.get("/employees", ensureLogin("/login"), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });

passportRouter.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = passportRouter;
