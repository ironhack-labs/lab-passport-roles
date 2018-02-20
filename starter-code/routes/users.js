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

// rutas de empleados

router.get("/",ensureLogin.ensureLoggedIn(),(req,res,next)=>{
  User.find({}, (err,docs)=>{
      if(err){
          next();
          return;
      }else{
         // console.log("8===========D")
          console.log(docs);
          res.render("employees/manage", {users:docs});
      }
    });
});

// 
router.get("/new",checkRoles('Boss'), (req, res, next) => {
  res.render("employees/new_user");
});

router.post("/new",(req,res,next)=>{
    const newUser=new User({
        name:req.body.name,
        username:req.body.username,
        familyName:req.body.familyName,
        role:req.body.role
    });
    newUser.save((err,celeb)=>{
        if (err){
          res.redirect("/new");
        }else{
          res.redirect("/");
        }
        
    });

})



router.get("/:id/edit",ensureOwnprofile,(req,res,next)=>{
  const id=req.params.id;
  console.log(id);
  User.findById(id,(err,doc)=>{
      if (err){
          next();
          return err;
      }else{
          console.log("8=========D")
          console.log("id")
          console.log(req.session._id)
          res.render("employees/edit",{user:doc,admin:(req.user.role === 'Boss')});
      }
  });
});

function ensureOwnprofile (req,res,next){
    if(req.user._id===req.params.id) return next();
    res.redirect("/");
}



router.post('/:id', (req, res, next) => {
    const productId = req.params.id;
    const username = req.body.username,
    password = req.body.password;
    if(username === "" || password === ""){
    res.render("employees/edit", {message: "Indicate username and password"});
    return;
    }

    User.findOne({username}, "username", (err, user)=>{
        if (user !== null){
        res.render("employees/edit", {message:"The username already exists"});
        return;
        }
        console.log(password, salt)
        const hashPass = bcrypt.hashSync(password, salt);

            const newUser = new User({
                name:req.body.name,
                username:username,
                familyName:req.body.familyName,
                password:hashPass,
                role:req.body.role
            });


        newUser.save(err=>{
        if (err) return res.render("employees/edit", { message: "Something went wrong" });
            res.redirect("/");
        });

        User.findByIdAndUpdate(productId, username, (err, u) => {
            if (err){ return next(err); }
            return res.redirect('/users');
        });
    });
});



router.post("/:id/delete", checkRoles('Boss'),(req,res,next)=>{
  const id=req.params.id;
  User.findByIdAndRemove(id,(err,doc)=>{
      if (err){
          next();
          return err;
      }else{
          res.redirect("/users");
      }
  })
});





//******************** handcrafted middlewares ************
//middleware for ensure login
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/login");
}
//middleware for ensure role
function checkRoles(role){
    return function(req, res,next){
        if(req.isAuthenticated() && req.user.role === role){
            return next();
        }else{
            res.redirect("/login");
        }
    }
}

module.exports = router;