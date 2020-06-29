const express = require('express');
const router = express.Router();
const User = require("../models/User.model")
const Course = require("../models/Course.model")
const passport = require("passport")
//Role checker 
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render("auth/login", {
    message: "Restricted area!"
})
//Login checker 
const isLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render("auth/login", {
    message: "Restricted area!"
})
//Username checkers
const userNameChecker = (req, rolenam) => {
    const formNames = req.body[rolenam].split(",")
    User.find({
            role: rolenam
        }, {
            username: 1
        })
        .then(users => formNames.every(name => users.includes(name))
            .then(console.log("HEHEE")))
}

router.get("/", isLoggedIn, checkRole(["TA"]), (req, res, next) => {
    Course.find({}, {
            title: 1
        })
        .then(courses => res.render("courses", {
            courses
        }))
})

router.get("/create", isLoggedIn, checkRole(["TA"]), (req, res, next) => res.render("courses/create"))

router.post("/create", isLoggedIn, checkRole(["TA"]), (req, res, next) => {
    const {
        title,
        startDate,
        endDate,
        courseImg,
        description,
        status
    } = req.body
    const developerArray = []
    const TaArray = []
    const studentsArray = []
    let filteredDevelopers;
    let filteredTAs;
    let filteredStudents;
    req.body.DEV.split(",").forEach(username => developerArray.push(User.find({
        username,
        role: "DEV"
    })))
    req.body.TA.split(",").forEach(username => TaArray.push(User.find({
        username,
        role: "TA"
    })))
    req.body.STUDENT.split(",").forEach(username => studentsArray.push(User.find({
        username,
        role: "STUDENT"
    })))
    Promise.all(developerArray)
        .then(developers => {
            filteredDevelopers = developers.flat().map(dev => dev.id)
            return Promise.all(TaArray)
        }).then(TAs => {
            filteredTAs = TAs.flat().map(ta => ta.id)
            return Promise.all(studentsArray)
        }).then(students => filteredStudents = students.flat().map(student => student.id))
        .then(() => Course.create({
            title,
            startDate,
            endDate,
            courseImg,
            description,
            status,
            leadTeacher: filteredDevelopers,
            ta: filteredTAs,
            students: filteredStudents
        })).then(course => {
            res.render("courses/details", course)
        })
        .catch(err => console.log("There was an error in DDBB: ", err))

})
router.get("/:id/details", isLoggedIn, checkRole(["TA"]), (req, res, next) => {
    Course.findById(req.params.id)
        .then(course => res.render("courses/details", course))
})






module.exports = router