const express = require('express');
const router = express.Router();
const passport = require('passport')

const User = require('../models/user.model')
const Course = require('../models/course.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10
// add routes here

//Creating users....
router.get('/create',(req, res, next) => res.render('create'))
router.post('/create', (req, res, next) => {

    const{ username, name, password, description, facebookId, role} = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("create", { message: "Indicate username and password" })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("create", { message: "The username already exists" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, name, password: hashPass, description, facebookId, role })
                .then(() => res.redirect('/auth/admin-index'))
                .catch(error => next(error))
        })
        .catch(error => next(error))

})


// LogIn
router.get('/admin-index',(req, res, next) => res.render('auth/admin-index'))

router.get("/login", (req, res, next) => res.render("auth/login", { "message": req.flash("error") }))
router.post("/login", passport.authenticate("local", {
    successRedirect: "/auth/admin-index",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
}))



//List users
router.get('/list-users',(req,res, next) => {

    User.find({}) 
    .then(users => res.render('auth/list-users', { users }))
    .catch(error => next(error))
})


//delete users
router.post('/delete/:id',(req,res,next) =>{

    User.findByIdAndRemove(req.params.id)
    .then(() => res.redirect('auth/list-users'))
    .catch(error => next(error))
    
})

// LOGOUT
router.get('auth/logout', (req, res, next) => {
    req.logout()
    res.render('auth/login', { message: 'You have successfully logged out' })
})


// TA SECTION

router.get('/create-courses',(req, res, next) => res.render('create-courses'))
router.post('/create-courses', (req, res, next) => {

    const{ title, leadteacher, startDate, endDate, ta, description, status, students} = req.body

        Course.create({ title, leadteacher, startDate, endDate, ta, description, status, students })
            .then(() => res.redirect('/ta-access'))
            .catch(error => next(error))
})

// Editing Courses
router.get('/edit-courses/:id',(req,res,next) => {

    const id = req.params.id
  
    Course.findById(id)
    .then(editCourse => res.render('edit',editCourse))
    .catch(error => next(error))
  })
  
  router.post('/edit-courses/:id',(req, res,next) => {
  
    const { title, leadteacher, startDate, endDate, ta, description, status, students } = req.body
    const id = req.params.id
  
    Course.findByIdAndUpdate(id, { title, leadteacher, startDate, endDate, ta, description, status, students })
    .then(() => res.redirect('/ta-access'))
    .catch(err => console.log('Error: ', err))
    })


//List Courses

router.get('/list-courses',(req,res, next) => {

    Course.find({}) 
    .then(courses => res.render('/list-courses', { courses }))
    .catch(error => next(error))
})


module.exports = router;
