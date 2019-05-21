const express = require('express');
const router  = express.Router();
const bodyParser   = require('body-parser');
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../models/User.model")

const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)





const isBoss = (req,res) => req.user.role === "BOSS"
const isDev = (req,res) => req.user.role === "DEVELOPER"
const isTA = (req,res) => req.user.role === "TA"



//PRIVATE INDEX MANAGEMENT PLATFORM

router.get("/private-index", (req, res, next) => {
  res.render("private/index", {user: req.user, boss:isBoss(req, res)})
})


//SIGNUP

router.get("/signup", checkRoles("BOSS"),(req, res, next) => {
  res.render("auth/signup")
})

router.post("/signup", (req, res, next) => {
  const {username, password, role} = req.body
  User.findOne({username})
    .then( foundUser => {
      if(foundUser) {
        console.log("ERROR USUARIO EXISTENTE")
        return
      }

    const hashPass = bcrypt.hashSync(password, salt)


      User.create({username, password: hashPass, role})
        .then( createdUser => {
          router.redirect("/auth/login")
        })
        .catch()
    })
    .catch()
})

//LOGIN

router.get("/login", (req, res, next) => res.render("auth/login"))

router.post('/login', passport.authenticate("local", {
  successRedirect: "/auth/private-index",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}))


//DELETE

router.get("/delete", lowSecurity, (req, res) => {
  User.find()
    .then( allUsers => {
      res.render("private/delete", {user: allUsers, boss: isBoss(req, res)})
    })
  
})

router.post("/:id/delete", checkRoles("BOSS"), (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then(x => res.redirect("/auth/delete"))
  }
)

//MYPROFILE

router.get("/profile", (req, res, next) => {
  res.render("private/profile", req.user)
})

// LOGOUT


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})




// BOSS PLATFORM DISCONTINUADA

router.get("/boss-platform", checkRoles("BOSS"), (req, res) => {
  res.render("private/boss-platform", { user: req.user, boss: isBoss(req,res)});
});





function checkRoles(role)
{
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      console.log("AUTENTICADO")
      return next();
    } else {
      console.log("NO AUTENTICADO")

      res.redirect('/auth/login')
    }
  }
}

function lowSecurity() {

 return function(req, res, next) { if (req.isAuthenticated() && (req.user.role === "BOSS"||req.user.role === "DEVELOPER"||req.user.role === "TA")) {true} }
}

module.exports = router

