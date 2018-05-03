const express     = require("express");
const authRoutes  = express.Router();
const passport    = require("passport");
// User model
const User        = require("../models/user");
const flash       = require("connect-flash");
const ensureLogin = require("connect-ensure-login");



// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


function isBoss () {
    return function(req, res, next) {
      if (req.isAuthenticated() && req.user.role === "BOSS") {
        return next();
      } else {
        res.redirect('/')
      }
    }
  }


authRoutes.get("/signup", isBoss(), (req, res, next) => {
  res.render("signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role =     req.body.role;

  if (username === "" || password === "") {
    res.render("signup", { message: `Please indicate username and password` });
    return;
  }

  User.findOne({ username:username }, "username", (err, user) => {
    if (user !== null) {
      res.render("signup", { 
        message: "Sorry, that username already exists" 
      });
      return
    }
   
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
      
    User.create({username:username, password:hashPass, role: role })
    .then((theUser) => {
      res.redirect('/')
    })
    .catch((err)=>{
      console.log(err);
    })


    const newUser = new User({
      username:username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});




authRoutes.get("/login", (req, res, next) => {
  res.render("login", { "message": req.flash("error") });
}); //end get login

authRoutes.post("/login", passport.authenticate("local",
{
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: false,
  passReqToCallback: true
}
));// end post /login

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {

    res.redirect('/login')
  }
}

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/')
    }
  }
}

const checkGuest  = checkRoles('GUEST');
const checkEditor = checkRoles('EDITOR');
const checkAdmin  = checkRoles('ADMIN');

authRoutes.get('/employees', checkRoles('BOSS'), (req, res) => {
  res.render('employees', {user: req.user});
});


module.exports = authRoutes;

