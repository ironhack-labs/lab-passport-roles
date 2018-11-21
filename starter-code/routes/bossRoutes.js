const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const saltRounds = 10;
const passport = require("passport");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isLogged");
const { roleCheck } = require("../middlewares/roleCheck");

router.get("/signup", roleCheck("Boss"), (req, res, next) => {
  res.render("signup");
});

router.get("/delete", roleCheck("Boss"), (req, res, next) => {
  res.render("delete");
});

router.post("/signup", roleCheck("Boss"), (req, res, next) => {
  const { username, password ,role} = req.body;
  if (username == "" || password == "") {
    res.render("../views/signup.hbs", {
      error: "Username and password needed"
    });
  } else {
    User.findOne({ username: username }, "username").then(data => {
      if (data == null) {
        const salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(username, salt);
        userdata = { username: username, password: hash, role:role };
        User.create(userdata).then(() => {
          res.redirect("/");
        });
      } else {
        res.render("../views/signup.hbs", { error: "Username already taken" });
      }
    });
  }
});

router.post("/delete", roleCheck("Boss"), (req, res, next) => {
  const { username } = req.body;
  if (username == "") {
    return res.render("delete", {
      error: "Username needed"
    });
  }
  if (username == req.user.username) {
    return res.render("delete", {
      error: "Cant delete yourself"
    });
  }
  User.findOne({ username: username }).then(data => {
    if (data == null) {
      return res.render("delete", {
        error: "User not found"
      });
    }
    User.findOneAndDelete({ username: username }).then(() =>
      res.render("delete", { error: "User deleted" })
    );
  });
});

module.exports = router;
