const express = require("express")
const router = express.Router()

const app = require('../app')

const Course = require("../models/course.model")

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })


router.get('/', ensureAuthenticated, (req, res) => {
    
    Course
        .find({})
        .then(response => {
            console.log(response)
            res.render('courses/courses', {response})
        })
        .catch(err => console.log(err))
});

router.get('/create', ensureAuthenticated, (req, res) => res.render('courses.create'))


module.exports = router