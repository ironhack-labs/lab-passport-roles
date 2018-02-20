const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
//ensure login
const ensureLogin = require("connect-ensure-login");
//passport
const passport = require("passport");


//login
router.get("/login", (req,res)=>{
   res.render("passport/login", {"message":req.flash("error")});
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

//logout
router.get("/logout", (req,res)=>{
   req.logout();
   res.redirect("/login");
});


router.get("/signup", (req,res, next)=>{
    res.render("passport/signup");
})

router.post("/signup", (req,res,next)=>{
    const username = req.body.username,
          password = req.body.password;
    if(username === "" || password === ""){
        res.render("passport/signup", {message: "Indicate username and password"});
        return;
    }

    User.findOne({username}, "username", (err, user)=>{
       if (user !== null){
           res.render("passport/signup", {message:"The username already exists"});
           return;
       }

       const hashPass = bcrypt.hashSync(password, salt);

       const newUser = new User({
          username,
          password:hashPass
       });

       newUser.save(err=>{
           if (err) return res.render("passport/signup", { message: "Something went wrong" });
            res.redirect("/");
       });

    });
});

//
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("private", { user: req.user });
  });

   
module.exports = router;