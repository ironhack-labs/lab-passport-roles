const express = require('express');
const authRoutes = express.Router();
const passport     = require('passport');
//User model
const User = require("../models/user");
const ensureLogin =require("connect-ensure-login");

//Bcrypt to encrypt
const bcrypt =require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup",(req, res, next)=>{
    res.render("auth/signup");
});

authRoutes.post("/signup",(req, res, next)=>{
    const username=req.body.username;
    const password=req.body.password;
    const role=req.body.role;

    if(username===""||password===""){
        res.render("auth/signup", { message: "Indicate username and password"});
        return;
    }
    User.findOne({username},"username",(err, user)=>{
        if(user !== null){
            res.render("auth/signup",{message: "The username already exists"});
            return;
        }
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser =new User({
            username,
            password: hashPass,
            role
        });

        newUser.save((err)=>{
            if(err){
                res.render("auth/signup",{message: "Some error"});
            }else{
                res.redirect("/admin");
            }
        });
    });
});

const checkBoss  = checkRoles('BOSS');
const checkDeveloper = checkRoles('DEVELOPER');
const checkTA  = checkRoles('TA');

authRoutes.get("/login", (req, res, next)=>{
    res.render("auth/login", {"message": req.flash("error")});
});

authRoutes.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));


authRoutes.get('/admin', checkBoss, (req, res) => {
    User.find().then(users=>{
        console.log(users);
        res.render('admin',{users, user: req.user});
      })
      .catch(e =>{
        console.log(e);
      })
    //res.render('admin', {user: req.user});
  });

  authRoutes.get('/admin/:id',(req, res, next)=>{
  let userID=req.params.id;
  User.remove({'_id':userID}).then(user=>{
    console.log(user);
    User.find().then(users=>{
        console.log(users);
        res.redirect("/admin");
        //res.render('admin',{users, user: req.user});
        ren
      })
      .catch(e =>{
        console.log(e);
      })
    //res.render('admin',{user: req.user});
  }).catch(error=>{
    console.log(error);
  })
  console.log("id",userID);
  
});  
  authRoutes.get('/courses', checkTA, (req, res) => {
    res.render('courses', {user: req.user});
  });

  function checkRoles(role) {
    return function(req, res, next) {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      } else {
        res.redirect('/login')
      }
    }
  }




authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(),(req, res)=>{
    res.render("private",{user: req.user});
})

authRoutes.get("/logout",(req, res)=>{
    req.logout();
    req.redirect("/login");
})

module.exports=authRoutes;