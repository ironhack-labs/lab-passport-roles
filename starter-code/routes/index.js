const express = require('express');
const router  = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/signup', (req, res, next) => {
  res.render('signup');
});


router.get('/login', (req, res, next) => {
  res.render('login');
});

function checkRoles(roles) {
  // eslint-disable-next-line
  return function(req, res, next) {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    } else {
      if (req.isAuthenticated()) {
        res.redirect('/private');
      } else {
        res.redirect("/login");
      }
    }
  };
}


// const checkBoss  = checkRoles('Boss');
// const checkDeveloper = checkRoles('Developer');
// const checkTA  = checkRoles('TA');

// router.get('/private', checkBoss, (req, res) => {
//   res.render('private', {user: req.user});
// });

// router.get('/privates', checkDeveloper, (req, res) => {
//   res.render('private', {user: req.user});
// });

// router.get('/private', checkTA, (req, res) => {
//   res.render('private', {user: req.user});
// });

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {  
  res.render("private", { user: req.user});
});	


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const roles = req.body.roles

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("private");
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hash,
      roles: roles
    });

    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/private");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});


router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/private",
  failureFlash: false,
  passReqToCallback: true
}));




module.exports = router;
