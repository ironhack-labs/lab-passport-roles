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

//see list of all users
router.get("/users", ensureLogin.ensureLoggedIn(), (req, res) => {
  User.find()
    .then(users => {
      res.render("users", { userArray: users });
    })
    .catch(error => {
      console.log(error);
    });
});

//add new user (only for boss)
router.get("/users/new", checkRoles("BOSS"), (req, res, next) => {
  res.render("new");
});

router.post("/users/new", checkRoles("BOSS"), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  console.log(role);

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

//edit profile
router.get("/users/edit", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then(user => {
      res.render("edit", user);
    })
    .catch(error => console.log(error));
});

router.post("/users/edit", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  User.findOneAndUpdate(
    { username: req.user.username },
    { username: username, password: hashPass }
  )
    .then(() => {
      res.redirect("/users");
    })
    .catch(error => console.log(error));
});

//delete user (only for boss)
router.post("/users/:userId/delete", checkRoles("BOSS"), (req, res, next) => {
  User.findOneAndRemove({ _id: req.params.userId })
    .then(() => {
      res.redirect("/users");
    })
    .catch(error => console.log(error));
});

//view profile
router.get("/users/:userId", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.findOne({ _id: req.params.userId })
    .then(user => {
      res.render("profile", user);
    })
    .catch(error => console.log(error));
});

module.exports = router;
