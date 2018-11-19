const express = require('express');
const router = express.Router();
// Require user model
const User = require('../models/User.js');
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport 
const passport = require('passport');
const session = require('express-session');
const ensureLogin = require("connect-ensure-login");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/login", (req, res) => {
  res.render("passport/login", { message: req.flash('error') });
});

router.get("/privateboss", checkRoles(["Boss"]), (req, res) => {
  User.find({})
    .then(user => {
      res.render('passport/privateboss', { user })
    })
    .catch(error => console.log("Error to find a user" + error))
})

router.get("/privateusers", checkRoles(["Boss"/*, "Developer", "TA"*/]), (req, res) => {
  User.find({})
    .then(user => {
      res.render('passport/privateusers', { user })
    })
    .catch(error => console.log("Error to find a user" + error))
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
})

function checkRoles(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && role.includes(req.user.rol)) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

router.post("/login", passport.authenticate("local", {
  successRedirect: "/privateusers",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.post('/privateboss', (req, res, next) => {
  const saltRounds = 5;
  const salt = bcrypt.genSaltSync(saltRounds);
  const genericUser = new User();
  genericUser.username = req.body.username;
  genericUser.password = bcrypt.hashSync(req.body.password, salt);
  genericUser.rol = req.body.rol;
  genericUser.save()
    .then(() => {
      res.redirect('/privateboss')
    })
    .catch(error => {
      console.log("Error to add a new user" + error)
      res.redirect('/privateboss')
    })
})

router.post('/:_id/delete', (req, res, next) => {
  User.findByIdAndRemove(req.params._id)
    .then(() => {
      res.redirect('/privateboss')
    })
    .catch(error => console.log("Error to remove a user" + error))
})

module.exports = router;
