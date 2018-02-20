const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

//check roles
const checkBoss  = checkRoles('Boss');
const checkDev = checkRoles('Dev');
const checkTA  = checkRoles('TA');

//ensure login
const ensureLogin = require("connect-ensure-login");

//passport
const passport = require("passport");


//security by roles
//new course
router.get("/courses/new", (req,res, next)=>{
    res.render("courses/new_course");
 });
 
 router.post("/courses/new", ensureAuthenticated, (req,res,next)=>{
    const newCourse = new Course({
        name: req.body.name,
        startingDate: req.body.startingDate,
        endDate:req.body.endDate,
        level:req.body.level,
        available:true
    });
    newCourse.save(err=>{
        if (err) return next(err);
        res.redirect("/courses/index");
    });
 });
 //own rooms
 router.get("/", ensureAuthenticated, (req,res,next)=>{
    Course.find({owner: req.user._id}, (err, courses)=>{
        if(err) return next(err);
        res.render("courses/index", {courses});
    }) ;
 });
 
 //role security
 router.get("/private", checkBoss, (req, res)=>{
     res.render("private", {user:req.user});
 });
 
 
 //private routes
 //private page
 router.get("/private",
     ensureLogin.ensureLoggedIn(),
     (req, res)=>{
 
         console.log(req.user);
         res.render("private", {user:req.user});
 
     });
 
 router.get("/private2", ensureAuthenticated, (req,res)=>{
    res.render("private", {user:req.user});
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