const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user")
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 10
// Add passport 
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");

const ensureLogin = require("connect-ensure-login");




// passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });


// Signup - Get
passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup')
})
// Signup - Post
passportRouter.post('/signup', (req, res, next) => {
  const { username, password, role  } = req.body


  if (!username || !password || !role) {
    // res.render("auth/signup", { errMsg: "Rellena los campos, gandul" })
    console.log("campos vacios")
    return
  }

  User.findOne({ username })
    .then(foundUser => {
      if (foundUser) {
        // res.render("auth/signup", { errMsg: "Sé más original, eso ya existe" })
        console.log('El usuario ya existe')
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)
      User.create({ username, password: hashPass, role })
      .then(createdUser => {
        console.log(createdUser)
        res.redirect("/")
      })
      .catch(err => console.log("Algo no va bien", err))

  })
  .catch(err => console.log("Buuuu", err))

    //   User.create({ username, password: hashPass })
    //     .then(createdUser => {
    //       console.log(createdUser)
    //       res.redirect("/")
    //     })
    //     .catch(err => console.log("Algo no va bien", err))

    // })
    // .catch(err => console.log("Buuuu", err))
})


// Login - Get
passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login')
})
// Login - Post
passportRouter.post('/login', passport.authenticate("login", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))


// // Private area

const isBoss = (req,res) => {
  if (req.user.role === "BOSS") return true
}
const isTA = (req,res) => {
  if (req.user.role === "TA") return true
}

passportRouter.get('/private-page', (req, res) => {
  let data = { user: req.user,  boss: isBoss(req,res) }
  console.log(data)
  res.render('passport/private', { user: req.user,  boss: isBoss(req,res) })
  
})



// passportRouter.get('/private-page',checkRoles("BOSS") , (req, res) => {
//   res.render('private', { user: req.user, boss: isBoss(req,res) })
// })

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
      res.redirect('/login')
    }
  }
}

module.exports = passportRouter;