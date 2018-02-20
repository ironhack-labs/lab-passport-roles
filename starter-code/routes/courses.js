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
  Course.find({}, (err,docs)=>{
      if(err){
          next();
          return;
      }else{
         // console.log("8===========D")
          console.log(docs);
          res.render("courses/index", {courses:docs});
      }
    });
});

// 
router.get("/new",checkRoles('TA'), (req, res, next) => {
  res.render("courses/new_course");
});

router.post("/new",(req,res,next)=>{
    const newCourse=new Course({
        name:req.body.name,
        startingDate:req.body.startingDate,
        endDate:req.body.endDate,
        level:req.body.level,
        available:true
    });
    newCourse.save((err,course)=>{
        if (err){
          res.redirect("/new");
        }else{
          res.redirect("/");
        }
        
    });

})



router.get("/:id/edit",checkRoles('TA'),(req,res,next)=>{
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
          res.render("courses/edit",{course:doc});
      }
  });
});


router.post('/:id', (req, res, next) => {
    const productId = req.params.id;
    const username = req.body.username,
    password = req.body.password;
    if(name === "" || level === ""){
    res.render("courses/edit_course", {message: "Indicate name and level"});
    return;
    }

    User.findOne({username}, "username", (err, user)=>{
        if (user !== null){
        res.render("courses/edit_course", {message:"The username already exists"});
        return;
        }
        console.log(password, salt)
        const hashPass = bcrypt.hashSync(password, salt);

            const newCourse = new Course({
                name:req.body.name,
                username:username,
                familyName:req.body.familyName,
                password:hashPass,
                role:req.body.role
            });


        newCourse.save(err=>{
        if (err) return res.render("courses/edit", { message: "Something went wrong" });
            res.redirect("/");
        });

        User.findByIdAndUpdate(productId, username, (err, u) => {
            if (err){ return next(err); }
            return res.redirect('/courses');
        });
    });
});



router.post("/:id/delete", checkRoles('TA'),(req,res,next)=>{
  const id=req.params.id;
  User.findByIdAndRemove(id,(err,doc)=>{
      if (err){
          next();
          return err;
      }else{
          res.redirect("/courses");
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
            res.redirect("/courses");
        }
    }
}

module.exports = router;