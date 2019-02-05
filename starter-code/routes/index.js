const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const flash = require("connect-flash");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

const checkBoss = checkRoles("BOSS");
const checkDeveloper = checkRoles("DEVELOPER");
const checkTA = checkRoles("TA");
const session = require("express-session");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//LOGIN
router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/administration",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

// ADMINISTRATION - BOSS
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
}
router.get("/administration", checkBoss, (req, res) => {
  res.render("administration", { user});
});

router.post("/administration", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("base", {
      message: "Indicate username and password",
      section: "administration"
    });
    return;
  }

  User.findOne({
    username
  })
    .then(user => {
      if (user !== null) {
        res.render("base", {
          message: "The username already exists",
          section: "administration"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role
      });

      newUser.save(err => {
        if (err) {
          res.render("base", {
            message: "Something went wrong",
            section: "administration"
          });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

//LOG OUT
router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("/login");
  });
});

module.exports = router;
