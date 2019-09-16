const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");
const secure = require("../middlewares/secure.mid");

const passportRouter = express.Router();
const bcryptSalt = 10;

// Log in
passportRouter.get("/", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post(
  "/",
  passport.authenticate("local-auth", {
    successRedirect: "/private",
    failureRedirect: "/",
    passReqToCallback: true,
    failureFlash: true
  })
);

// Creating users
passportRouter.get("/create-employee", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post(
  "/create-employee",
  secure.checkRole("Boss"),
  (req, res, next) => {
    const { username, password, role } = req.body;

    if (username === "" || password === "") {
      res.render("passport/signup", {
        message: "Please indicate username and password"
      });
    }

    User.findOne({ username })
      .then(user => {
        if (user) {
          res.render("passport/signup", { message: "Username already exists" });
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
          username,
          password: hashPass,
          role
        });

        newUser
          .save()
          .then(() => res.redirect("/users"))
          .catch(error => next(error));
      })
      .catch(error => next(error));
  }
);

// Private area
passportRouter.get("/private", secure.checkLogin, (req, res) => {
  res.render("passport/private", {
    user: req.user,
    isBoss: req.user.role === "Boss"
  });
});

// List of employees
passportRouter.get("/users", secure.checkLogin, (req, res, next) => {
  User.find()
    .then(users => {
      res.render("passport/users", { users, isBoss: req.user.role === "Boss" });
    })
    .catch(err => next(err));
});

// Employee detail
passportRouter.get("/users/:id", secure.checkLogin, (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      res.render("passport/user", { user, isSameUser: (req.params.id === req.user.id) });
    })
    .catch(err => next(err));
});

passportRouter.post(
  "/users/:id",
  (req, res, next) => {
    if (req.params.id === req.user.id) {
      User.updateOne(
        { _id: req.params.id },
        { $set: { username: req.body.username } }
      ).then(user => {
        res.redirect("/users/" + req.params.id);
      }).catch(err => next(err));
    } else {
      res.redirect("/users");
    }
  }
);

// Delete employees
passportRouter.post(
  "/users/:id/delete",
  secure.checkRole("Boss"),
  (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
      .then(res.redirect("/users"))
      .catch(err => next(err));
  }
);

module.exports = passportRouter;
