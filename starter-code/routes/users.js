const express = require('express');
const router = express.Router();
const users = require("../models/User");
const courses = require('../models/Course');

const localStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");




function checkRoles(roles) {
  // eslint-disable-next-line
  return function (req, res, next) {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    } else {
      if (req.isAuthenticated()) {
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    }
  };
}


// js curry
const checkBoss = checkRoles("Boss");
const checkDev = checkRoles("Dev");
const checkTA = checkRoles("TA");
const checkAll = function (req, res, next) {
  console.log(req.isAuthenticated())
  return req.isAuthenticated();
}


function allCourses(){
  let coursesTotal = undefined;
  courses.find()
  .then((coursesFound)=>{
    coursesTotal = coursesFound;
  })

}

router.get('/', ensureLogin.ensureLoggedIn(), (req, res, next) => {

  let totalCourses = allCourses();

});



router.get('/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  users.findOne({ _id: req.params.id })
    .then((userFound) => {
      console.log(userFound)
      if (userFound.role === "TA") {
        res.render('users/TA', userFound)
      } else if (userFound.role === "Dev") {
        res.render('users/Dev', userFound)
      } else if (userFound.role === "Boss") {
        res.render('users/Boss', userFound)
      }
    })
    .catch(() => {
      next()
    })

});

// router.get('/:id/edit', (req, res, next) => {
//   res.render('users/edit',user)
// });

router.post('/:id', (req, res, next) => {
  users.updateOne(
    { _id: req.body.id },
    {
      username: req.body.username,
      password: req.body.password,
      role: req.body.role
    }
  )
    .then(() => {
      res.redirect('/users')
    })

})

router.post('/:id/edit', (req, res, next) => {
  users.findOne({ _id: req.body.id })
    .then((user) => {
      res.render('users/edit', user)
    })
    .catch(() => {
      next()
    })
});

router.post('/:id/delete', (req, res, next) => {
  users.findByIdAndRemove(req.body.id)
    .then(() => {
      res.redirect('/users')
    })
    .catch(() => {
      next()
    })
});


router.get('/new', (req, res, next) => {
  res.render('users/new')

});

router.post('/', (req, res, next) => {
  users.create({
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  })
    .then(() => {
      res.redirect('/users')
    })
});

module.exports = router;