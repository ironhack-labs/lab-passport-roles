const express = require("express");
const siteController = express.Router();
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const Course = require('../models/course');
const User = require("../models/user");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/')
    }
  }
}

siteController.get("/listStudents", function(req, res, next){
  User.find({}, (err, doc)=>{
    if(err){
    } else {
      res.render("studentList", {students: doc})
    }
  })
})

siteController.get("/coursesStudents", function(req, res, next){
  Course.find({}, (err, doc)=>{
    if(err){
    } else {
      res.render("courseList", {courses: doc})
    }
  })
})

siteController.get("/courses", checkRoles("TA"), function(req, res, next){
  if (req.isAuthenticated()){
    Course.find({}, (err, doc)=>{
      courses = doc;
      User.find({}, (err, doc2)=>{
      res.render('courses', {user: req.user, courses: courses, students: doc2});
      })
    })
  } else {
    res.redirect("/login");
  }
})

siteController.post("/courses", checkRoles("TA"), function(req, res, next){
  if (req.isAuthenticated()){
    const newCourse = new Course({
      name: req.body.name,
      startingDate: req.body.startingDate,
      endDate: req.body.endDate,
      level: req.body.level,
      available: req.body.available,
      alumni: []
    });
     newCourse.save(err=>{
          res.redirect("/courses");
     });
  } else {
    res.redirect("/login");
  }
})

siteController.post("/courses/:id", checkRoles("TA"), function(req, res, next){
  if(req.isAuthenticated()){
    Course.findOneAndUpdate({_id:req.params.id}, {
        name: req.body.name,
        startingDate: req.body.startingDate, 
        endDate: req.body.endDate,
        level: req.body.level,
        available: req.body.available
        },(err)=>{
      if (err) {
        next();
        return;   
      } else{
        res.redirect("/courses");
      }
      });
  } else{
      res.redirect("/login")
  }
});

siteController.post("/courses/:id/add", checkRoles("TA"), function(req, res, next){
  if(req.isAuthenticated()){
    if (req.body.alumni!=null){
      Course.findOneAndUpdate({_id:req.params.id}, {
        $push: { alumni: req.body.alumni}
          },(err)=>{
        if (err) {
          next();
          return;   
        } else{
          res.redirect("/courses");
        }
        });
    } else {
      res.redirect("/courses");
    }
    
  } else{
      res.redirect("/login")
  }
});

siteController.get("/courses/:id/remove", checkRoles("TA"), function(req, res, next){
  if (req.isAuthenticated()){
    Course.deleteOne({_id: req.params.id}, (err, doc)=>{
      res.redirect("/courses")
    })
  } else {
    res.redirect("/login");
  }
})

siteController.get("/courses/:id/edit", checkRoles("TA"), function(req, res, next){
  if (req.isAuthenticated()){
    Course.findOne({_id: req.params.id}, (err, doc)=>{
      res.render("editCourse", {course: doc});
    })
  } else {
    res.redirect("/login");
  }
})


siteController.get("/", (req, res, next) => {
  if (req.isAuthenticated()){
    User.find({}, (err, doc)=>{
      employees = doc;
      res.render('index', {user: req.user, employees: employees});
    })
  } else {
    res.redirect("/login");
  }
});

siteController.get("/login", (req, res, next) => {
  if (req.isAuthenticated()){
    res.redirect("/")
    } else {
      res.render("login");
    }
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get('/private', checkRoles('Boss'), (req, res) => {
  let employees = [];
  User.find({}, (err, doc)=>{
    employees = doc;
    res.render('private', {user: req.user, message:null, employees: employees});
  })
});

siteController.post('/private/add', (req, res) => {
  let employees = [];
  User.find({}, (err, doc)=>{
    employees = doc;
    const username = req.body.username,
        password = req.body.password;
  if(username === "" || password === ""){
      res.render("private", {user: req.user, message: "Indicate username and password", employees: employees});
      return;
  }

  User.findOne({username}, "username", (err, user)=>{
     if (user !== null){
         res.render("private", {user: req.user, message:"The username already exists", employees: employees});
         return;
     }

     const hashPass = bcrypt.hashSync(password, bcryptSalt);

     const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      familyName: req.body.familyName,
      password: hashPass,
      role: req.body.role,
      facebookId: ""
    });
     newUser.save(err=>{
         if (err) return res.render("private", {user: req.user, message: "Something went wrong", employees: employees});
          res.redirect("/private");
     });

  });
  })
  
});

siteController.post('/private/remove', (req, res) => {
  let employees = [];
  User.find({}, (err, doc)=>{
    employees = doc; 
    const username = req.body.username

    User.findOne({username}, "username", (err, user)=>{
       if (user == null){
           res.render("private", {user: req.user, message:"That employee doesn't exist", employees: employees});
           return;
       } else {
        User.deleteOne({username}, (err, user2)=>{
          if (err){
            return res.render("private", {user: req.user, message: "Something went wrong", employees: employees});
          } else {
            res.redirect("/private")
          }
        })
       }
  
    });
  })
 
});

siteController.get("/:username", (req, res)=>{
  User.findOne({username:req.params.username}, (err,doc)=>{
    if(err){
      res.redirect("/private");
    } else {
      if (req.isAuthenticated() && req.user.role!="Student") {
        if (req.user.username === req.params.username) {
          res.render("show", {showUser: doc, mine: true})
        } else {
          res.render("show", {showUser: doc, mine: false})
        }
      } else {
        res.redirect('/login')
      }
    }
  })
});

siteController.post("/:username", (req, res)=>{
  if(req.isAuthenticated() && req.user.role!="Student"){
    User.findOneAndUpdate({username:req.params.username}, {
        userName: req.body.username,
        name: req.body.name, 
        familyName: req.body.familyName,
        password: bcrypt.hashSync(req.body.password, bcryptSalt),
        },(err)=>{
      if (err) {
        next();
        return;   
      } else{
        res.redirect("/"+req.body.username);
      }
      });
  } else{
      res.redirect("/login")
  }
});

siteController.get('/:username/edit', function(req, res, next) {
  User.findOne({username:req.params.username}, (err,doc)=>{
    if(err){
      res.redirect("/private");
    } else {
      if (req.isAuthenticated() && req.user.role!="Student") {
        if (req.user.username === req.params.username) {
          res.render("edit", {user: doc})
        } else {
          res.redirect("/private");
        }
      } else {
        res.redirect('/login')
      }
    }
  })
});





module.exports = siteController;
