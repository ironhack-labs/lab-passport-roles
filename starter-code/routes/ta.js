var express = require('express');
var router = express.Router();

const auth        = require("../helpers/auth");
// User model
// const User        = require("../models/user");
const Course        = require("../models/course");
const addUser     = require("../helpers/adduser");

var checkBoss = auth.checkRoles("BOSS");
var checkTa = auth.checkRoles("TA");

router.get("/courses", checkTa, (req, res)=>{
  Course.find({}, (err, courses)=>{
    res.render("ta/list", {courses});
  })
})

router.get("/courses/new", checkTa, (req, res)=>{
  res.render("ta/new");
})

router.post("/courses", checkTa, (req, res)=>{
  Course({title: req.body.title, content: req.body.content}).save(err=>{
    if(err) {next(err); return;}
    res.redirect("/courses");
  })
})

router.get("/courses/:courseId/delete", checkTa, (req, res)=>{
  Course.findOneAndRemove({"_id":req.params.courseId}, err=>{
    if(err) {next(err); return; }
    res.redirect('/courses');
  })
});

router.get("/courses/:courseId/edit", checkTa, (req, res)=>{
  Course.findOne({"_id":req.params.courseId}, (err,course)=>{
    if(err) {next(err); return; }
    res.render('ta/edit', {course});
  })
});

router.post("/courses/:courseId", checkTa, (req, res)=>{
  Course.findOneAndUpdate(
       {"_id":req.params.courseId},
       {title:req.body.title, content:req.body.content},
       (err,course)=>{
          if(err) {next(err); return; }
          res.redirect('/courses');
      });
});

module.exports = router;