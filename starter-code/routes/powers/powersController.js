const express = require("express");
const powersController = express.Router();
const passport = require("passport");
const User = require("../../models/users");
const Course = require("../../models/courses");
const bcrypt = require("bcrypt");
const bcryptSalt     = 10;

powersController.get('/view', checkPowers(), (req, res, next) => {
})

powersController.post('/adduser', (req, res, next) => {

  var salt     = bcrypt.genSaltSync(bcryptSalt);

  const newUser = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: req.body.role
  });
  newUser.save((err) => {
    if (err) { res.redirect('/powers/view'); }
    res.render('powers/bosspowers', {users: [newUser] });
    });
});

powersController.post('/listusers', (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) { return next(err) }
    
    res.render('powers/bosspowers', {
      users: users
  });
});
});

powersController.post('/:userID/deleteuser', (req, res, next) => {
    User.findByIdAndRemove(req.params.userID, (err, users) => {
      if (err) { return next(err) }
      User.find({}, (err, users) => {
        if (err) { return next(err) }
        
        res.render('powers/bosspowers', {
          users: users
      });
    });
    });
});

powersController.post('/:userID/edituser', (req, res, next) => {
  
  const infoUser = {
    firstName: req.body.firstName, 
    lastName: req.body.lastName,
  };
  
  User.findByIdAndUpdate(req.params.userID, infoUser, (err, users) => {

    if (err) { return next(err) }
    User.find({}, (err, users) => {
      if (err) { return next(err) }
      
      res.render('powers/bosspowers', {
        users: users
    });
  });
  });
});

powersController.post('/addcourse', (req, res, next) => {
  
    const newCourse = new Course({
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      level: req.body.level,
      available: req.body.available
    });
    newUser.save((err) => {
      if (err) { res.redirect('/powers/view'); }
      res.render('powers/tapowers', {courses: [newCourse] });
      });
  });

  powersController.post('/listcourses', (req, res, next) => {
    Course.find({}, (err, courses) => {
      if (err) { return next(err) }
      
      res.render('powers/tapowers', {
        courses: courses
    });
    });
  });


powersController.post('/:courseID/course', (req, res, next) => {
    
    const infoCourse = {
      name: req.body.name, 
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      level: req.body.level,
      available: req.body.available
    };
    
    User.findByIdAndUpdate(req.params.userID, infoCourse, (err, users) => {
  
      if (err) { return next(err) }
      User.find({}, (err, users) => {
        if (err) { return next(err) }
        
        res.render('powers/tapowers', {
          courses: courses
      });
    });
    });
  });


powersController.post('/:courseID/courseuser', (req, res, next) => {
  Course.findByIdAndRemove(req.params.courseID, (err, courses) => {
    if (err) { return next(err) }
    Course.find({}, (err, courses) => {
      if (err) { return next(err) }
      
      res.render('powers/tapowers', {
        courses: courses
    });
  });
  });
});

function checkPowers() {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.redirect('/login');
    } else if (req.user.role === 'Boss') {
      res.render('powers/bosspowers', {users: []}); 
    } else if (req.user.role === 'TA') {
      res.render('powers/tapowers', {courses: []}); 
    } else if (req.user.role === 'Developer') {
      res.render('powers/developerpowers'); 
    } else if (req.user.role === 'Alumni') {
      res.render('powers/alumnipowers');
    } else {
      res.redirect('/login')
    }
  }
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  } else {
    res.redirect('/login')
  }
}

module.exports = powersController;