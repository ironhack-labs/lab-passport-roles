// routes/auth-routes.js
const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "admin/userList",
    failureRedirect: "auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

authRoutes.get("/admin/userList", ensureLogin.ensureLoggedIn(), (req, res) => {
  User.find({})
    .sort({ role: -1 })
    .exec((err, users) => {
      res.render("admin/userList", {
        users
      });
    });
});

authRoutes.get("/admin/addUser", (req, res, next) => {
  res.render("admin/addUser");
});

authRoutes.post("/admin/addUser", (req, res, next) => {
  const username = req.body.usernameR;
  const name = req.body.nameR;
  const familyName = req.body.familyNameR;
  const password = req.body.passwordR;
  const role = req.body.roleR;

  console.log("TETTTTTTT", username);

  if (username === "" || password === "") {
    res.render("error", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("error", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      name: name,
      familyName: familyName,
      password: hashPass,
      role: role
    });
    console.log("NEW USER INFO", newUser);
    newUser.save(err => {
      if (err) {
        res.render("error", { message: "Something went wrong" });
      } else {
        res.redirect("userList");
      }
    });
  });
});

authRoutes.get("/admin/edit/:userId", (req, res, next) => {
  User.findOne({ _id: req.params.userId }, (err, user) => {
    if (err) {
      next(err);
      return;
    }
    res.render("admin/edit", { user });
  });
});

authRoutes.post("admin/delete/:userId", (req, res) => {
  User.findOneAndRemove({ _id: req.params.userId }, err => {
    if (err) {
      next(err);
      return;
    }
    res.redirect("admin/userList");
  });
});

authRoutes.post("admin/edit/:userId", (req, res) => {
  const username = req.body.usernameR;
  const name = req.body.nameR;
  const familyName = req.body.familyNameR;
  const password = req.body.passwordR;
  const role = req.body.roleR;

  if (username === "" || password === "") {
    res.render("error", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("error", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.findOneAndUpdate(
      { _id: req.user.id },
      {
        username: username,
        name: name,
        familyName: familyName,
        password: hashPass,
        role: role
      },
      (err, user) => {
        if (err) {
          next(err);
          return;
        }
        res.redirect("admin/userList");
      }
    );
  });
});

module.exports = authRoutes;
