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
const checkRoles = require("../auth/checkRoles");

//// Routes

// Get overview of all the users
passportRouter.get("/employees", ensureLogin("/login"), (req, res, next) => {
  let allowedEdits = false;
  User.find({})
    .then(user => {
      if (req.user.role === "BOSS") {
        allowedEdits = true;
      }
      res.render("passport/employees", { user, currentUser: req.user.username, allowed: allowedEdits });
    })
    .catch(e => next(e));
});

// Edit user - GET
passportRouter.get("/editemployee/:id", checkRoles("BOSS"), (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      res.render("passport/editEmployee", { user, role: user.role });
    })
    .catch(e => next(e));
});

// Edit user - POST
passportRouter.post("/editemployee/:id", checkRoles("BOSS"), (req, res, next) => {
  const { username, password, role } = req.body;
  if (!password) {
    console.log("Update without password");
    User.updateOne({ _id: req.params.id }, { $set: { username, role } })
      .then(() => {
        res.redirect("/employees");
      })
      .catch(e => next(e));
  } else {
    bcrypt
      .hash(password, 10)
      .then(hash => {
        User.updateOne({ _id: req.params.id }, { $set: { username, password: hash, role } })
          .then(() => {
            res.redirect("/employees");
          })
          .catch(e => next(e));
      })
      .catch(e => next(e));
  }
});

// Edit profile - GET
passportRouter.get("/editprofile", ensureLogin("/login"), (req, res, next) => {
  User.findById(req.user.id)
    .then(user => {
      res.render("passport/editProfile", { user, role: user.role });
    })
    .catch(e => next(e));
});

// Edit profile - POST
passportRouter.post("/editprofile", ensureLogin("/login"), (req, res, next) => {
  const { username, password } = req.body;
  if (!password) {
    console.log("Update without password");
    User.updateOne({ _id: req.user.id }, { $set: { username } })
      .then(() => {
        res.redirect("/welcome");
      })
      .catch(e => next(e));
  } else {
    bcrypt
      .hash(password, 10)
      .then(hash => {
        User.updateOne({ _id: req.user.id }, { $set: { username, password: hash } })
          .then(() => {
            res.redirect("/welcome");
          })
          .catch(e => next(e));
      })
      .catch(e => next(e));
  }
});

// Add a new user - GET
passportRouter.get("/addemployee", checkRoles("BOSS"), (req, res, next) => {
  res.render("passport/addEmployee", { message: req.flash("error") });
});

// Add a new user - POST
passportRouter.post("/addemployee", checkRoles("BOSS"), (req, res, next) => {
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
          res.redirect("/employees");
        });
      });
    });
});

// Delete User - GET
passportRouter.get("/deleteemployee/:id", checkRoles("BOSS"), (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect("/employees");
    })
    .catch(e => next(e));
});

// Welcome - GET
passportRouter.get("/welcome", ensureLogin("/login"), (req, res, next) => {
  res.render("passport/accessGranted", { currentUser: req.user.username, currentRole: req.user.role });
});

// Login - GET
passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login", { message: req.flash("error") });
});

// Login - POST
passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/login",
    failureFlash: true
  })
);

// Logout - GET
passportRouter.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = passportRouter;
