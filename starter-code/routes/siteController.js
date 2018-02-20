const express = require("express");
const siteController = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);


//passport
const passport = require("passport");
//login
siteController.get("/login", (req,res)=>{
   res.render("sitecontroller/login");
});

siteController.post("/login", passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

// siteController.get("/index", (req,res, next)=>{
//   res.render("sitecontroller/index");

siteController.get("/signup", (req,res, next)=>{
    res.render("sitecontroller/signup");
})

.post("/signup", (req,res,next)=>{
    const username = req.body.username,
          password = req.body.password;
    if(username === "" || password === ""){
        res.render("sitecontroller/signup", {message: "Indicate username and password"});
        return;
    }

    User.findOne({username}, "username", (err, user)=>{
       if (user !== null){
           res.render("sitecontroller/signup", {message:"The username already exists"});
           return;
       }

       const hashPass = bcrypt.hashSync(password, salt);

       const newUser = new User({
          username,
          password:hashPass
       });

       newUser.save(err=>{
           if (err) return res.render("sitecontroller/signup", { message: "Something went wrong" });
            res.redirect("/");
       });

    });
});

module.exports = siteController;






// siteController.get("/signup", (req,res, next)=>{
//   res.render("sitecontroller/signup");
// })

// .post("/signup", (req,res,next)=>{
//   const username = req.body.username,
//         password = req.body.password;
//   if(username === "" || password === ""){
//       res.render("auth/signup", {message: "Indicate username and password"});
//       return;
//   }

//   User.findOne({username}, "username", (err, user)=>{
//      if (user !== null){
//          res.render("sitecontroller/signup", {message:"The username already exists"});
//          return;
//      }

//      const hashPass = bcrypt.hashSync(password, salt);

//      const newUser = new User({
//         username,
//         password:hashPass
//      });

//      newUser.save(err=>{
//          if (err) return res.render("sitecontroller/signup", { message: "Something went wrong" });
//           res.redirect("/");
//      });

//   });
// });

// module.exports = siteController;

// siteController.get("/", (req, res, next) => {
//   res.render("index");
// });

// module.exports = siteController;
