const express        = require("express");
const courseRouter = express.Router();
// Require user model
const Course = require("../models/Course")

// Add passport 
const passport = require("passport")



function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role || req.user.role==="BOSS") {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

function checkIfSelforBoss() {
  return function(req, res, next) {
    if (""+req.params.id==""+req.user._id||req.user.role=="BOSS") {
      return next()
    } else {
      res.redirect('/login')
    }
  }
}

function checkAuth() {
  return function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkTA  = checkRoles('TA');
const checkDeveloper = checkRoles('DEVELOPER');
const checkBoss  = checkRoles('BOSS');

courseRouter.get("/", checkAuth(), (req, res) => {
  Course.find()
  .then(courses => res.render("courses/index", {courses}))
  .catch(err    => next(err))
})


courseRouter.get("/new", checkTA, (req, res) => res.render("courses/new"))

courseRouter.post('/new', checkTA,(req, res) => {

  const {name, description} = req.body
  const course = new Course({name, description})

  course.save()
    .then(()  => res.redirect('/courses'))
    .catch(() => res.redirect('/courses/new'))
})

courseRouter.get("/:id", (req, res) => {
  Course.findById(req.params.id)
  .then(course   => {
    res.render("courses/show", {course}) 
  })
  .catch(err    => next(err))
})

courseRouter.get("/:id/edit", checkTA, (req, res) => {
  Course.findById(req.params.id)
  .then(course   => {
    res.render("courses/edit", {course}) 
  })
  .catch(err    => next(err))
})

courseRouter.post("/:id/edit", checkTA, (req, res) => {
  const {name, description} = req.body
  
  Course.updateOne({_id: req.params.id}, { $set: {name, description}})
  .then(()    => res.redirect('/courses'))
  .catch(err  => next(err))
})

courseRouter.post("/:id/delete", checkTA, (req, res) => {
  Course.findByIdAndRemove(req.params.id)
  .then(()   => res.redirect('/courses'))
  .catch(err    => next(err))
})


module.exports = courseRouter;