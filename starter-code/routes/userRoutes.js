const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/User");
const authMiddle = require("./authRoleMiddleware");
const passport = require("passport");

router.get("/signup", authMiddle("Boss"), (req, res, next) => {
  res.render("user/signup");
});

router.post("/signup", authMiddle("Boss"), (req, res, next) => {
  const { username, password, role } = req.body;

  const newUser = new userModel({ role, username, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) });
  newUser
    .save()
    .then(data => res.json(data))
    .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("user/login");
});
router.get("/list", ensureAuthenticated, (req, res, next) => {
  userModel
    .find()
    .then(users => {
      const usersList = users.map(user => {
        if (req.user.role === "Boss") {
          user.isBoss = true;
        } else {
          user.isBoss = false;
        }
        if (user._id.toString() === req.user.id) {
          user.isMe = true;
        } else {
          user.isMe = false;
        }
        return user;
      });

      console.log({ usersList });
      res.render("user/listusers", { users: usersList });
    })
    .catch(err => next(err));
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/user/list",
    failureRedirect: "/user/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/user/login");
  }
}
module.exports = router;
