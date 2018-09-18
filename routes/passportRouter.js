const express = require("express");
const router = express.Router();
// User model
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private-boss",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", { message: "The username already exists" });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save(err => {
        if (err) {
          res.render("auth/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect("/users");
    }
  };
}
router.get("/private-boss", checkRoles("BOSS"), (req, res) => {
  User.find()
    .then(users => {
      res.render("passport/privateBoss", { users });
    })
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.post("/users/:id/delete", (req, res, next) => {
  const { userId } = req.body;
  User.findByIdAndRemove(userId)
    .then(deleted => {
      res.redirect("/private-boss");
    })
    .catch(next);
});

router.get("/users/new", checkRoles("BOSS"), (req, res) => {
  User.find()
    .then(users => {
      res.render("users/new");
    })
});

router.post("/users/new", (req, res, next) => {
  const { username, password, role } = req.body;
  User.create({ username, password, role })
    .then(celebrity => {
      res.redirect("/private-boss");
    })
    .catch(e => console.log(e));
});

router.get("/users", (req, res, next) => {
  User.find()
    .then(users => {
      res.render("users/employees", { users });
    })
    .catch(next);
});

router.get("/users/:id", (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      console.log(req.session);
      if (req.isAuthenticated() && req.session.passport.user === req.params.id) {
        res.render("users/myProfile", { user });
      } else{
        res.render("users/profile", { user });
      }
    })
    .catch(next);
});


module.exports = router;
