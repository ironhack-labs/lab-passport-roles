const express = require("express");
const mongoose = require('mongoose');
const courseRouter = express.Router();
const Course = require('../models/course');
const bodyParser = require('body-parser');
courseRouter.use(bodyParser.urlencoded({ extended: true }));


const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const flash = require('connect-flash');

const ensureLogin = require("connect-ensure-login");


function checkRoles(role) {
    return function (req, res, next) {
        if (req.isAuthenticated() && role.includes(req.user.role)) {
            return next();
        } else {
            res.render('permissionDenied', req.user)
        }
    }
}

courseRouter.get('/courses', ensureLogin.ensureLoggedIn(), checkRoles(['TA']), (req, res, next) => {
    Course.find()
        .then((courses) => {
            res.render('courses/index', { courses })
        })
        .catch((err) => {
            next(err)
        })
})


courseRouter.post('/create-course', ensureLogin.ensureLoggedIn(), checkRoles(['TA']), (req, res, next) => {
    const { name, duration } = req.body;
    let newCourse = new Course({ name, duration });

    newCourse.save()
        .then(() => {
            res.redirect('/courses');
        })
        .catch((err) => {
            next(err);
        })
})


courseRouter.post('/delete-course/:id', ensureLogin.ensureLoggedIn(), checkRoles(['TA']), (req, res, next) => {
    Course.findByIdAndRemove(req.params.id)
        .then(() => {
            res.redirect('/courses');
        })
        .catch((err) => {
            next(err);
        })
})

courseRouter.get('/edit-course/:id', ensureLogin.ensureLoggedIn(), checkRoles(['TA']), (req, res, next) => {
    
    Course.findById(req.params.id)
        .then((course) => {
            res.render('courses/editCourse',  course );
        })
        .catch((err) => {
            next(err);
        })
})

courseRouter.post('/edit-course/:id', ensureLogin.ensureLoggedIn(), checkRoles(['TA']), (req, res, next) => {
    const { name, duration } = req.body;
    
    Course.findByIdAndUpdate(req.params.id, { name, duration })
        .then(() => {
            res.redirect('/courses');
        })
        .catch((err) => {
            next(err);
            
        })
})


module.exports = courseRouter;