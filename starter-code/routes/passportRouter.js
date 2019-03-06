 const express = require("express");
  const passportRouter = express.Router();
  
  // Require user model
  const User = require("../models/User")
  // Add bcrypt to encrypt passwords
  const bcrypt = require("bcrypt")
  const bcryptSalt = 10
  
  // Add passport 
  const passport = require("passport")
  const ensureLogin = require("connect-ensure-login")
  
  
  passportRouter.get("/signup", checkRoles("BOSS"), (req, res) => {
  res.render("passport/signup")})  
  
  passportRouter.post("/signup", checkRoles("BOSS"), (req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    const role = req.body.role
    
    
    if (username === "" || password === "") {
      res.render("passport/signup", { message: "Indicate username and password" })
      return
    }
  
    User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", { message: "The username already exists" })
        return
      }
  
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt)
  
      const newUser = new User({ username, password: hashPass, role})
  

      User.findOne({username}, (err, user) => {
        if (err) return next(err)
    
        if (!user) return next(null, false, {message: "Incorrect username"})
    
        if (!bcrypt.compareSync(password, user.password)) next(null, false, { message: "Incorrect password" })
    
        debug('User logged in!')
        
        return next(null, user)
      })

      newUser.save((err) => {
        if (err) { res.render("passport/signup", { message: "Something went wrong" })}
        else { res.redirect("/") }})})
        .catch(error => { next(error) })
  })


  passportRouter.get("/show", (req, res) => {
    User.find()
    .then(users => res.render("passport/show", {users}))
    .catch(error    => console.log(error))
   
   })
  
  
  passportRouter.get("/login", (req, res, next) => {
    res.render("passport/login", { "message": req.flash("error") })
  })
  
  passportRouter.post("/login", passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  }))
  
  
  passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("passport/private", {user: req.user }) 
  })
  
  passportRouter.post("/deleteUser", (req, res) => {
    User.findOneAndRemove({username: req.body.username})
    .then(()=>res.redirect("/signup"))
  })
  
  
  passportRouter.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
  })
  

  

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

  
  module.exports = passportRouter

