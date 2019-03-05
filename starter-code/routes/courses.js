const express = require("express");
const Router = express.Router();

const User = require('../models/User')
const Course = require('../models/Course')


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}



// const checkBoss = checkRoles('Boss')
// const checkDeveloper = checkRoles('Developer')
const checkTA  = checkRoles('TA')
// const checkStudent = checkRoles("Student")

Router.get("/", ensureAuthenticated, (req, res, next) => {
  
  Course.find()
  .then(courses => {
    res.render("courses/index", {courses});
  })
  .catch(err => {
      console.log('Error while finding all courses', err)
      next(err)
  })
})

Router.post("/new", checkTA, (req, res, next) => {
    const {title, description, students} = req.body

    const studentsArr = students.split(",")
   
    const newCourse = new Course({title, description, students:studentsArr}) 
    
    newCourse.save()
    .then(newCourse  => res.redirect('/courses'))
    .catch(error      => {
        console.log(`Error saving new users: ${error}`)
        res.render("courses/new")
    })
    
})

Router.get("/new", checkTA, (req, res, next) => {
  res.render("courses/new")
})

Router.get("/:id", ensureAuthenticated, (req, res, next) => {
  var studentNames = []
  Course.findById(req.params.id)
    .then(course => {
        course.students.forEach((student) => {
          User.findById(student.trim())
            .then(user => {
              studentNames.push(user.username)
            })
        })
    })
    .catch(err => {
        console.log('Error while retrieving students', err)
    })
    .then (() => {
        Course.findById(req.params.id)
          .then(course => {
            res.render("courses/course", {course, studentNames})
        })
          .catch(err => {
            console.log('Error while finding the course', err)
            next(err)
        })
    })
})

Router.post("/:id/delete", checkTA, (req, res, next) => {
 
    Course.findByIdAndRemove(req.params.id)
      .then(course => {
        console.log("He borrado el course " +  course)
        res.redirect("/courses")
      })
      .catch(err => {
          console.log('Error while deleting a course', err)
          next(err)
      })
  })

  Router.post("/:id/edit", checkTA, (req, res, next) => {

      Course.findById(req.params.id)
      .then(course => {
        res.render("courses/edit", {course})
      })
      .catch(err => {
          console.log('Error while finding a user to edit', err)
          next(err)
      })
  })

  Router.post("/:id/edited", checkTA, (req, res, next) => {
    const {title, description, students} = req.body

    const studentsArr = students.split(",")

    Course.update({_id: req.params.id},  { $set: {title, description, students: studentsArr}})
    .then(course    => res.redirect('/courses'))
    .catch(err => {
      console.log('Error while updating a course', err)
      next(err)
    })
  })
  


module.exports = Router;