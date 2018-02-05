const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;



const User = require('../models/user');

function checkRoles(role) {
    return function (req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        } else {
            res.redirect('/login');
        }
    }
}

// router for views/login page
router.get('/login', (req, res, next) => {
    return res.render('login', {
        message: req.flash('error')
    });
});


router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

//user want to get employees page: localhost:3000/employees
//protected by boss role
router.get('/boss', checkRoles('Boss'), (req, res, next) => {
    User.find({
        role: {
            $ne: 'Boss' // not equal Boss (Employees)
        }
    }, (err, users) => {
        if (err) {
            return next(err);
        }

        //render view
        return res.render('bosspage', {
            employees: users
        });
    });
});

router.post('/boss', (req, res, next) => {
    User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err) return next(err);
        if (!user) {

            var salt = bcrypt.genSaltSync(bcryptSalt);
            const password = "ironhack";
            var encryptedPass = bcrypt.hashSync(password, salt);


            var employeeInfo = {
                username: req.body.username,
                role: req.body.role,
                password: encryptedPass
            };

            User.create(new User(employeeInfo), (err, user) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/boss');
            });
        } else {
            return res.redirect('/boss');
        }
    });
});

router.post('/boss/:employeeId/delete', (req, res, next) => {
    User.findOneAndRemove({
        _id: req.params.employeeId
    }, (err) => {
        if (err) {
            return next(err);
        }
        return res.redirect('/boss');
    });
});

module.exports = router;