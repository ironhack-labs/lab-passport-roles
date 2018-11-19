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

const Superrol = ["Boss"];
const Adminsrol = ["Boss", "Developer", "TA"];

function checkRoles(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && role.includes(req.user.rol)) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/login", (req, res) => {
  res.render("passport/login", { message: req.flash('error') });
});

router.get("/privateboss", checkRoles(Superrol), (req, res) => {
  User.find({})
    .then(user => {
      res.render('passport/privateboss', { user })
    })
    .catch(error => console.log("Error to find a user" + error))
})

router.get("/privateusers", checkRoles(Adminsrol), (req, res) => {
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

router.get('/privateusers/:_id', checkRoles(Adminsrol), (req, res, next) => {
  User.findById(req.params._id)
    .then(user => {
      if (user._id === req.params._id) {
        res.render('passport/privateuserown', { user })
      } else {
        res.render('passport/privateuserid', { user })
      }
    })
    .catch(error => console.log("Error to find a user" + error))
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/privateusers",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.post('/privateboss', checkRoles(Superrol), (req, res, next) => {
  if (req.body.username === "" || req.body.password === "") {
    console.log("The username & passwords value cant be null")
    res.redirect('/privateboss')
  } else {
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
        console.log("Error to create a new user" + error)
        res.redirect('/privateusers')
      })
  }
})

router.post('/:_id/edit', checkRoles(Adminsrol), (req, res, next) => {
  const saltRounds = 5;
  const salt = bcrypt.genSaltSync(saltRounds);
  userEdited = {}
  userEdited.username = req.body.username;
  userEdited.password = bcrypt.hashSync(req.body.password, salt);;
  userEdited.rol = user.rol;
  User.findByIdAndUpdate(req.params._id, userEdited)
    .then(() => {
      res.redirect('/privateusers')
    })
    .catch(error => console.log("Error to update a user" + error))
})

router.post('/:_id/delete', checkRoles(Superrol), (req, res, next) => {
  User.findByIdAndRemove(req.params._id)
    .then(() => {
      res.redirect('/privateboss')
    })
    .catch(error => console.log("Error to remove a user" + error))
})

module.exports = router;
