const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")
const passport = require("passport")
const mongoose = require("mongoose")
const User = require("../models/user")

const ensureLogin = require("connect-ensure-login");
mongoose.connect("mondodb://localhost/Users")

function checkRoles(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role == role) {
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

router.get("/signup", (req, res) => {
  res.render("passport/signup")
})

router.post("/signup", (req, res) => {
  const { username, password, role } = req.body;
  if (username === "" || password === "" || role === "") {
    res.redirect("signup", {
      message: "Indicate username, password and role"
    });
    return
  }
  const saltRounds = 5;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password: hash,
    role
  })
  newUser.save()
    .then(() => {
      res.redirect("/login")

    })
    .catch(err => {
      console.log(err)
    })
})


router.get("/login", (req, res) => {
  res.render("passport/login")
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

const checkBoss = checkRoles('BOSS');
const checkTA = checkRoles('TA');
const checkDev = checkRoles('DEVELOPER');

router.get("/private-page", (req, res) => {
  res.render('passport/private', { user: req.username });
})

router.get('/private-boss', ensureLogin.ensureLoggedIn(), checkBoss, (req, res) => {
  res.render('passport/private-boss', { user: req.user });
});

router.get("/private-boss/new", (req, res) => {
  res.render("passport/new")
})

router.post("/private-boss", (req, res) => {
  const { username, password, role } = req.body;
  const saltRounds = 5;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  const newUser = new User({ username, password: hash, role })
  newUser.save()
    .then(() => {
      res.redirect("/private-boss")
    })
    .catch((error) => {
      console.log(error)
    })
})
router.get("/private-boss/delete", (req, res) => {
  User.find()
  .then((users) => {
    res.render("passport/delete", {users})
  })

})
router.post("/private-boss/:id/delete", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/private-boss")
    })
    .catch((err) => {
      console.log(err)
    })
})

router.get('/private-ta', ensureLogin.ensureLoggedIn(), checkTA, (req, res) => {
  res.render('passport/private-ta', { user: req.user });
});

router.get('/private-dev', ensureLogin.ensureLoggedIn(),(req, res) => {
  res.render('passport/private-dev', { user: req.user });
});

module.exports = router;