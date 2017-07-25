const express = require("express");
const siteController = express.Router();
const passport      = require("passport");
const bcrypt        = require("bcrypt");
const User = require('../models/user');
const Course = require('../models/course');

const bcryptSalt = 10;


function ensureAuthenticated(req, res, next) {
  console.log(req.isAuthenticated())
  if (req.isAuthenticated()) {
    return next(); 
  } else {
    res.redirect('/')
  }
}
//Global for pages
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next(); 
    } else {
      res.redirect('/login')
    }
  }
}
var checkGuest  = checkRoles('DEV');
var checkEditor = checkRoles('STUDENT');
var checkAdmin  = checkRoles('BOSS');

function authEdit(userSessionId, userProfileId) {
        if(userSessionId == userProfileId ) {
          return true;
        } else {
          return false;
        }
    }


siteController.get("/", (req, res, next) => {
  
  res.render("index", { "message": req.flash("error") });
});



siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/admin",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

siteController.get('/admin', ensureAuthenticated, (req, res, next)=>{
    
      User.find({}, {}, (err, users)=>{
         usersList = users;
        Course.find({}, {}, (err, courses)=>{
           courseList = courses;
          res.render('admin', {user: req.user, role: req.user.role, courseList, usersList, message:  req.flash("info") });

        } );
        
      } );
     

  
});

siteController.post('/new', ensureAuthenticated, (req, res, next)=>{
  const username = req.body.username;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const password = req.body.password;
  const role = req.body.role;

  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);


  const newUser = new User ({
    username : username,
    name: name,
    familyName : familyName,
    password: hashPass,
    role: role
  })

  newUser.save((err) => {
    res.redirect('/admin');
  });
  
});

siteController.get('/:id/delete', (req, res, next)=> {
  User.findByIdAndRemove(req.params.id, (err , user)=>{
    req.flash('info', `${user.name} deleted`)
    res.redirect('/admin')
  })
  
})


siteController.get('/admin/:id', ensureAuthenticated, (req, res, next)=>{
    
    
    

    User.findById(req.params.id, (err, docs)=>{
      //console.log("tesete", docs, authEdit(req.user._id, req.params.id))
      userOne = docs;
      res.render('admin/profile', {user: req.user, role: req.user.role, userOne, authEdit: authEdit(req.user._id, req.params.id) });
    } )
  
});

siteController.get('/admin/:id/edit', ensureAuthenticated, (req, res, next)=>{
    
    if(authEdit(req.user._id, req.params.id)) {

       User.findById(req.params.id, (err, docs)=>{
        userOne = docs;

        res.render('admin/edit', {user: req.user, role: req.user.role, userOne, authEdit: authEdit(req.user._id, req.params.id), message: req.flash("update") });
      
      } );

    } else {

      res.redirect('/admin');
    
    }  

});

siteController.post('/admin/:id/update', (req, res, next)=>{
  const userId = req.params.id;
  
  const updates = {
    username : req.body.username,
    name : req.body.name,
    familyName : req.body.familyName,
    password : req.body.password
  };
  console.log(userId)
  

  User.findByIdAndUpdate(userId, updates, (err, user)=>{
    
    if(err){
      req.flash('update', `Error updating`);
      res.redirect(`/admin/${userId}/edit`);
    } else {
      req.flash('updateok', `Update ok`);
      res.redirect(`/admin/${userId}/edit`);
    }
    
  });
  
});

siteController.post('/admin/new-course', (req, res, next)=> {
  const name = req.body.name;
  const startingDate = req.body.startingDate;
  const endDate = req.body.endDate;
  const level = req.body.level;
  const available = req.body.available;

  const newCourse = new Course({
      name: name,
      startingDate: startingDate,
      endDate: endDate,
      level: level,
      available: available
  })
  
  newCourse.save((err)=>{
    res.redirect('/admin');
  })

  
});

siteController.get('/:id/delete-course', (req, res, next)=> {
  Course.findByIdAndRemove(req.params.id, (err , course)=>{
    req.flash('info', `${course.name} deleted`)
    res.redirect('/admin')
  })
  
})

siteController.get("/auth/facebook", passport.authenticate("facebook"));
siteController.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/admin",
  failureRedirect: "/"
}));

siteController.post('/:id/insert-course', (req, res, next)=>{
    const courseId = req.body.courseId;
    User.findById(req.params.id, (err, docs)=>{
      //console.log("tesete", docs, authEdit(req.user._id, req.params.id))
      console.log('user', docs)
      
        Course.findById(courseId, (err, course)=>{
          course.students.push(docs);
          console.log('course', course.students)

          course.save((err)=>{
            res.redirect('/admin');
          });
          
          
        })
        
      
    } )
      

    
    
});

module.exports = siteController;
