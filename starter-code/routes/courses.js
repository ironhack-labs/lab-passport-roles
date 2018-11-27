const routerCourse = require('express').Router()
const Course = require('../models/Course')
const User = require('../models/User')
const passport = require('passport')

function isRole(role){
  return function(req,res,next){
    if(role === req.user.role){
      return next()
    }
    return res.redirect('/auth/login')
  } 
}


routerCourse.get('/delete/:id', isRole("TA"), (req,res,next) => {
  const {id} = req.params
  Course.findByIdAndDelete(id)
  .then( response => {
    res.redirect('/courses/list')
  })
  .catch(err => next(err))
})


routerCourse.get('/edit/:id', (req,res,next) => {
  const {id} = req.params
  Course.findById(id)
  .then( course => {
    res.render('courses/edit', course)
  })
  .catch( err => {

  })
  
})

routerCourse.post('/edit', (req,res,next) => {
  const {title,content} = req.body
  Course.findOneAndUpdate({$set: {title,content}})
  .then( course => {
    res.redirect('/courses/list')
  })
  .catch( err => next(err))
})


routerCourse.get('/create', (req,res,next) => {
  res.render('courses/create')
})

routerCourse.post('/create', isRole("TA"), (req,res,next) => {
  const {id} = req.user
  req.body['userId'] = id
  Course.create(req.body)
  .then( course => {
    User.findByIdAndUpdate(id, {$push: {courses: course._id}})
    .then( user => {
      console.log(user.courses)
      res.redirect('/courses/list')
    })
  })
})

routerCourse.get('/list', (req,res,next) => {
  Course.find().populate('userId')
  .then( courses => {
    const myUser = req.user.role === "TA"
    res.render('courses/list', {courses, myUser})
  })
  .catch(err => {
    next(err)
  })
})

module.exports = routerCourse