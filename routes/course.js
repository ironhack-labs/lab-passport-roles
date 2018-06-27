const express = require('express');
const router = express.Router();

const Course = require('../models/course');
const User = require('../models/user');

function checkRoles(role) {
    return function (req, res, next) {

        if (req.isAuthenticated() && req.user.role === "TA") {
            return next();
        }

        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        }else{
            res.redirect('/login')
        }
    }
}

const checkTA = checkRoles('TA');
const checkStudent = checkRoles('STUDENT');

router.get("/courses",checkStudent, (req, res) => {
    Course.find({}, (err, courses) => {
        res.render("course/manager/list", {courses:courses,authUser: req.user});
    });
});

router.get("/course/:id/details", checkStudent, (req, res) => {
    Course.findById(req.params.id, (err, course) => {
        res.render("course/view", {course:course,authUser: req.user});
    });
});

router.get("/course/add", checkTA, (req, res) => {
    res.render("course/manager/add");
});

router.post("/course/add", checkTA, (req, res) => {
    Course.create(req.body,()=>{
        res.redirect("/courses");
    })
});

router.get("/course/:id/edit", checkTA, (req, res) => {
    Course.findById(req.params.id, (err, course) => {
        User.find({},(err, users) => {
            res.render("course/manager/edit", {course:course,authUser: req.user,users:users});
        });
    });
});

router.post("/course/:id/edit", checkTA, (req, res) => {
    Course.updateOne({_id:req.params.id},req.body,()=>{
        res.redirect("/courses");
    })
});

router.post("/course/:id/delete", checkTA, (req, res) => {
    Course.deleteOne({_id:req.params.id},()=>{
        res.redirect("/courses");
    })
});

router.post("/course/:id/assign/:userid", checkTA, (req, res) => {
    Course.updateOne({_id:req.params.id},{$push: {assignedUser: req.params.userid }},()=>{
        res.redirect("/course/"+req.params.id+"/edit");
    })
});

router.post("/course/:id/unassign/:userid", checkTA, (req, res) => {
     Course.updateOne({_id:req.params.id},{$pull: {assignedUser: req.params.userid } },()=>{
        res.redirect("/course/"+req.params.id+"/edit");
    })
});

module.exports = router;