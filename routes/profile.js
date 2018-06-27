const express = require('express');
const router = express.Router();

const Course = require('../models/course');
const User = require('../models/user');

function checkRoles(role) {
    return function (req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        }else{
            res.redirect('/login')
        }
    }
}

const checkStudents = checkRoles('STUDENT');

router.get("/profiles/", checkStudents, (req, res) => {
        User.find({},(err, users) => {
            res.render("profiles/list", { authUser: req.user, users:users });
        });
});

router.get("/profile/:id", checkStudents, (req, res) => {
    User.findOne({_id:req.params.id},(err, user) => {
        res.render("profiles/view", { authUser: req.user, user:user });
    });
});


module.exports = router;