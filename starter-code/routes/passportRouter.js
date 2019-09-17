const express        = require("express");
const passportRouter = express.Router();
const secure = require('../middlewares/secure.mid');



// Require user model
const User = require('../models/user');

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


// Add passport 
const passport = require('passport');


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup", { user: req.user });
});

passportRouter.get("/login", (req, res) => {
  res.render("passport/login", { user: req.user });
});


passportRouter.post("/signup", (req, res, next) => {
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

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

passportRouter.post('/login', passport.authenticate('local-auth', {
  successRedirect: '/private-page',
  failureRedirect: '/login',
  passReqToCallback: true,
  failureFlash: true,
}));




function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

passportRouter.get('/login', checkRoles('Boost'), (req, res) => {
  res.render('private', {user: req.user});
});

const checkBoost  = checkRoles('Boost');
const checkDeveloper = checkRoles('Developer');
const checkTA  = checkRoles('TA');

passportRouter.get('/modifyemployees', checkBoost, (req, res) => {
  res.render('passport/add-and-remove-employees', {user: req.user});
});

passportRouter.get('/posts', checkDeveloper, (req, res) => {
  res.render('private', {user: req.user});
});

passportRouter.get('/posts', checkTA, (req, res) => {
  res.render('private', {user: req.user});
});

module.exports = passportRouter;