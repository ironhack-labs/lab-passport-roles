const express = require('express');
const router  = express.Router();

// User model
const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const passport = require("passport");

const ensureLogin = require("connect-ensure-login");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


const checkBOSS = function(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'BOSS') {
    console.log('what, really the boss.')
    next();
  } else {
    res.redirect('/login')
  }
}



router.get('/signup', checkBOSS, (req, res) => {
  res.render('auth/signup', {user: req.user});
});

router.post("/signup", checkBOSS, (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const tagline = req.body.tagline;


  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      tagline,
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});



router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/allusers', ensureLogin.ensureLoggedIn('/auth/login'), (req, res) => {
  User.find().then((user) => {
    console.log("user TEST", user)
    res.render('allusers', { user: req.user });
    })
})


router.get("/mytagline", ensureLogin.ensureLoggedIn('/auth/login'), (req, res) => {
  res.render("mytagline", { user: req.user });
});











module.exports = router;
