const express = require("express");
const router = express.Router();

const User = require("../models/User.model")
const passport = require("passport")
const bcrypt = require("bcrypt");

const bcryptSalt = 10;
const isTA = 0;



router.get("/login", (req, res, next) => {
  res.render("user/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true,
    passReqToCallback: true
  })
  );

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {

    if(req.user.role == "ADMIN"){
      console.log("pp es grande")
      return next()}
      
      
      
    
  
      return next();
    } else {
      res.redirect("/");
    }
  }
  router.get("/list",ensureAuthenticated, (req, res, next) => {
    User.find()
      .then(allUser => res.render("user/DaviLista", { gabis: allUser }))
      .catch(error => console.log(error));
  });
  
  router.get("/signUp",ensureAuthenticated, (req, res) => res.render("user/signUp"));

    router.post("/signUp", (req, res) => {
      const { username, password, role } = req.body;
      if(role == "TA") isTA = 1
      
      if (!username || !password) {
        res.render("user/signUp", { errmsg: "campos no rellenados" });
        return;
      }
      User.findOne({ username }).then(foundUser => {
        if (foundUser) {
          res.render("user/signUp", { errmsg: "Usuario ya existente" });
          return;
        }
        const actRole = role
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashpass = bcrypt.hashSync(password, salt);
        
        User.create({ username, password: hashpass, role: actRole})
        .then(user => {
          console.log(user);
          res.redirect("list");
        })
        .catch(err => console.log(err));
      });
    });
    
    router.get("/detail/:user_id",ensureAuthenticated ,(req, res) => {
      User.findById(req.params.user_id)
        .then(user => res.render("user/user-detail", { gabis: user }))
        .catch(error => console.log("buenos ", error));
    });
  
  router.post("/delete/:user_id",ensureAuthenticated, (req, res, next) => {
    const id = req.params.user_id;
    User.findByIdAndDelete({ _id: id })
      .then(user => res.redirect("/"))
      .catch(error => console.log(error));
    
    });
  

  router.get("/createCourse", ensureAuthenticated, (req, res, next) =>{
      res.render("")
      
    
  });

  router.get("/logout", (req, res) => {
    console.log("llega")
    req.logout();
    res.redirect("/");
    console.log("completo")
  });

  
  module.exports = router;