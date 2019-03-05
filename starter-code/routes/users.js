const express = require("express");
const Router = express.Router();

const User = require('../models/User')
const Course = require('../models/Course')

const bcrypt      = require("bcrypt");
const bcryptSalt  = 10;

const salt = bcrypt.genSaltSync(bcryptSalt);

const ensureLogin = require("connect-ensure-login")

let isBoss = false
let myOwnProfile = false

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

function confirmBoss(req, res, next) {

  if (req.user.role === "Boss") {
    isBoss = true
  }
  return next()
}

function confirmOwn(req, res, next) {

  if (req.user._id == req.params.id) {
    myOwnProfile = true
  }
  return next ()
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

const checkBoss = checkRoles('Boss')
// const checkDeveloper = checkRoles('Developer')
// const checkTA  = checkRoles('TA')
// const checkStudent = checkRoles("Student")

Router.get("/", [ensureAuthenticated, confirmBoss], (req, res, next) => {
  
  User.find()
  .then(users => {
    res.render("users/index", {users, isBoss});
    isBoss = false
  })
  .catch(err => {
      console.log('Error while finding all users', err)
      next(err)
  })
})

Router.post("/new", checkBoss, (req, res, next) => {
    const {picURL, username, role, bio} = req.body
   
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({picURL, username, password: hashPass, role, bio}) 
    
    newUser.save()
    .then(newUser  => res.redirect('/users'))
    .catch(error      => {
        console.log(`Error saving new users: ${error}`)
        res.render("users/new")
    })
})

Router.get("/new", checkBoss, (req, res, next) => {
  res.render("users/new")
})

Router.get("/:id", [ensureAuthenticated, confirmOwn, confirmBoss], (req, res, next) => {
  
  let userCourses = []

  User.findById(req.params.id)
    .then(user => {
      Course.find()
        .then(courses => {
          courses.forEach (course => {
            course.students.forEach (student => {
              if (student == user._id){
                userCourses.push(course.title)
              }
            })
          })
        })
    })
    .catch(err => {
        console.log('Error while getting the user courses', err)
    })

    User.findById(req.params.id)
    .then(user => {
      console.log(userCourses)
    res.render("users/profile", {user, myOwnProfile, isBoss, userCourses})
      myOwnProfile = false
      isBoss = false
    })
    .catch(err => {
      console.log('Error while finding the user', err)
      next(err)
  })
})

Router.post("/:id/delete", checkBoss, (req, res, next) => {
 
    User.findByIdAndRemove(req.params.id)
      .then(user => {
        console.log("He borrado el user " +  user)
        res.redirect("/users")
      })
      .catch(err => {
          console.log('Error while deleting a user', err)
          next(err)
      })
  })

  Router.post("/:id/edit", [confirmBoss, confirmOwn], (req, res, next) => {

    if (req.isAuthenticated() && (isBoss || myOwnProfile)) {
      User.findById(req.params.id)
      .then(user => {
        res.render("users/edit", {user})
        myOwnProfile = false
        isBoss = false
      })
      .catch(err => {
          console.log('Error while finding a user to edit', err)
          next(err)
      })
    } else {
      res.redirect('/login')
    }
  })

  Router.post("/:id/edited", checkBoss, (req, res, next) => {
    const {username, role, bio} = req.body

    User.update({_id: req.params.id},  { $set: {username, role, bio}})
    .then(user    => res.redirect('/users'))
    .catch(err => {
      console.log('Error while updating a user', err)
      next(err)
    })
  })
  


module.exports = Router;