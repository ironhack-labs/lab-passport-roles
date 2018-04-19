const passport = require("passport");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user-model");
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
// ------------ ***** AUTHENTIFICATION ROUTES *******-----------------------
// GET Signup page
router.get("/signup", (req, res, next) => {
  res.render("signup-form");
});
// POST signup
router.post("/process-signup", (req, res, next) => {
  const { username, password } = req.body;
  if (password === "" || password.match(/[0-9]/) === null) {
    res.redirect("/signup");
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(password, salt);
  User.create({ username, encryptedPassword })
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});
router.get("/login", (req, res, next) => {
  res.render("login-form");
});
router.post("/process-login", (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;
  User.findOne({ username })
    .then(userDetails => {
      if (!userDetails) {
        console.log(userDetails);
        res.redirect("/login");
        return;
      }
      // if code arrives here it means the email is good
      const { encryptedPassword } = userDetails;
      if (!bcrypt.compareSync(password, encryptedPassword)) {
        console.log("marchepa2");
        res.redirect("/login");
        return;
      }
      //  "req.login()" is Passport's method for logging a user in
      req.login(userDetails, () => {
        console.log("marche");
        res.redirect("/");
      });
    })
    .catch(err => {
      next(err);
    });
});
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});
// ------------ ***** ADMIN ROUTES *******-----------------------
router.get("/admin/users", (req, res, next) => {
  if (!req.user || req.user.role !== "Boss") {
    next();
  }
  User.find()
    .then(usersFromDb => {
      res.locals.userList = usersFromDb;
      res.render("user-list-page");
    })
    .catch(err => {
      next(err);
    });
});

router.get('/admin/users/add', (req, res, next) => {
  res.render('signup-form');
});


module.exports = router;