const siteController = require("express").Router()
const User = require("../models/User")
const checkBoss  = checkRoles('Boss')
const bcrypt         = require("bcrypt")
const bcryptSalt     = 10
const salt = bcrypt.genSaltSync(bcryptSalt)

siteController.get('/profile/:employeeId', (req, res, next) => {
  const employeeId = req.params.employeeId

  User.findById(employeeId)
  .then(() => res.render('employee/profile', {employee: employee}))
  .catch(err => next(err))
})

siteController.get("/", (req, res, next) => {
  res.render("home" ,{user:req.user})
})

siteController.get("/employee/new", checkBoss, (req, res, next) => {
  res.render("employee/new", {user:req.user})
})


siteController.get("/employees", (req, res, next) => {
  User.find()
      .then(users => res.render('employee/list', { employees: users, user:req.user }))
      .catch(err => next(err))
})

siteController.post("/employees", checkBoss, (req, res, next) => {
  const employeeInfo = {
    name: req.body.firstname,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
    role: req.body.role
  }

  new User(employeeInfo)
    .save()
    .then(() => res.redirect('/employees'))
    .catch(err => res.render('employee/new'))
})

siteController.get('/:employeeId/delete', checkBoss, (req, res, next) => {
  const employeeId = req.params.employeeId
  User.findByIdAndRemove(employeeId)
      .then(() => res.redirect('/employees'))
      .catch(err => next(err))
})



function checkRoles(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) next()
    else res.redirect('/')
  }
}

// siteController.use((req, res, next) => {
//   if (req.isAuthenticated()) next()
//   else res.redirect('/')
// })


module.exports = siteController
