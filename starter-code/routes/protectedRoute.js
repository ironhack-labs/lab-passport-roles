const express        = require("express")
const protectedRoute = express.Router()

// Require user model
const User = require('../models/User')

// Add bcrypt to encrypt passwords
const bcrypt         = require("bcrypt")
const bcryptSalt     = 10

// Add passport 
const session        = require("express-session")
const passport       = require("passport")
const LocalStrategy  = require("passport-local").Strategy
const ensureLogin    = require("connect-ensure-login")

function checkRoles(role) {
    return function(req, res, next) {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      } else {
        res.redirect('/login')
      }
    }
  }

const checkBoss  = checkRoles('BOSS');
const checkDeveloper = checkRoles('DEVELOPER');
const checkTa  = checkRoles('TA');

passport.serializeUser((user, cb) => {
  cb(null, user._id)
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user)
  });
});

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" })
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" })
    }

    return next(null, user)
  });
}));

protectedRoute.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));

protectedRoute.use(passport.initialize())
protectedRoute.use(passport.session())

protectedRoute.get("/login", (req, res) => {
  res.render("passport/login")
});

protectedRoute.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

protectedRoute.get("/users-manager", checkBoss, (req, res) => {
  User.find()
    .then(users => {
        res.render("passport/users-manager", {users});
  })
  .catch(err => console.log('Error', err))
})

protectedRoute.post("/users-manager/:id/delete", (req, res) =>{
    User.findByIdAndRemove(req.params.id)
    .then(user => res.redirect("/users-manager"))
})


protectedRoute.get("/user-list", ensureLogin.ensureLoggedIn(), (req, res) => {
    User.find()
    .then(users => {
        res.render("user-list", {users});
  })
  .catch(err => console.log('Error', err))
  })

protectedRoute.get("/user-list/:id", ensureLogin.ensureLoggedIn(), (req, res) => {
    console.log(req.params.id);
  
    User.findById(req.params.id)
      .then(user=> {
        console.log(user);
        res.render("user-info", {user})
      })
  })

module.exports = protectedRoute