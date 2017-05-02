var express = require('express');
var router = express.Router();

const auth        = require("../helpers/auth");
// User model
const User        = require("../models/user");
const Course        = require("../models/course");
const addUser     = require("../helpers/adduser");

var checkStudent = auth.checkRoles("BOSS");
var checkUser = auth.checkRoles(["DEVELOPER", "TA"]);

router.get('/student', (req, res)=>{
  // console.log("req.session: ",req.session)
  // console.log("req.user: ",req.user)
  User.find({"role":"STUDENT"}, (err, students)=>{
    if(err) {next(err); return;}
    User.find({"facebookId": req.user.id}, (err, me)=>{
 
      Course.find({"students":{$elemMatch:{$eq:me[0].id}}}, (err, courses)=>{
        if(err) {next(err); return;}

        res.render('students/home', {user:req.user, students, courses});
      });
    })

  });
});



module.exports=router;