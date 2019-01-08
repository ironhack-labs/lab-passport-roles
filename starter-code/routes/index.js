const express = require('express');
const router  = express.Router();
const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {title: "Ironhack User Management"});
});

router.get("/signup", checkRoles("Boss"), (req, res, next) => {
  res.render("signup",  {user: req.user});
});

router.post("/signup", checkRoles("Boss"), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const group = req.body.group;

  if (username === "" || password === "") {
    res.render("signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role: group
    });

    newUser.save((err) => {
      if (err) {
        res.render("signup", { message: "Something went wrong" });
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
  res.render("login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/userlist", ensureLogin.ensureLoggedIn(), (req, res) => {
  User.find().then(
    users => {
      if (users.length !=0) {
        res.render("userlist", { users: users,loggedInUser: req.user });
    }
  })
});

router.get("/useredit/:userid", ensureLogin.ensureLoggedIn(), (req, res) => {
  //req.user.id
  User.findOne({_id:req.params.userid}).then((user) => {
    // console.log(user);
    // console.log(req.user);
    if (user._id.toString() === req.user._id.toString()) {
      res.render('useredit',{user: user});
    } else {
      res.send("Not allowed!");
    }
    
  })
});
module.exports = router;
