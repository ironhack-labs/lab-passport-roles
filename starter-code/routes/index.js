const express = require("express");
const router = express.Router();
let User = require('../models/user');
const ensureLogin = require("connect-ensure-login");

// Bcrypt to encrypt passwords
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;

router.get("/", ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  console.log(req.user);
  res.render("index",{title: 'Homepage',
  user : {
    username: req.user.username,
    role: req.user.role},
    message: ''
  });
});


// Check ensureLoggedIn
router.get('/signup-private', (req, res, next) => {
   console.log(req.user);
  // check if rol is BOOS
    if (req.isAuthenticated() && req.user.role === 'Boss') {
      console.log("ok, you have access");
      res.render('signup');
    } else {
      console.log("Warning, you do not have permission to access");
      res.render('index',
          {title: 'Homepage',
          user : {
            username: req.user.username,
            role: req.user.role
          }, message: 'You dont have permission to create a new employee'});
    }
});

router.post("/signup-private", (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "" || name === "" || familyName === "" || role === "") {
    res.render("signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("signup", { message: "The username already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username: username,
      name: name,
      familyName : familyName,
      password: hashPass,
      role:role
    });

    newUser.save((err,user) => {
      if (err) {
        res.render("signup", { message: "Something went wrong" });
      } else {
        console.log('New employee created!!!!');
        res.render("signup", {message: "New Employee created!!!"});
      }
    });
  });
});



module.exports = router;
