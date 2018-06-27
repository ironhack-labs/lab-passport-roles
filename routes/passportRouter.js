const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require('../models/user');

function checkRoles(role) {
    return function (req, res, next) {

        if (req.isAuthenticated() && req.user.role === "BOSS") {
            return next();
        }

        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        }else{
            if(role == "BOSS" || role == "MANAGER"){
                res.redirect('/admin/login')
            }else{
                res.redirect('/login')
            }
        }
    }
}

const checkAlumni = checkRoles('ALUMNI');
const checkTA = checkRoles('TA');
const checkBoss = checkRoles('BOSS');
const checkManager = checkRoles('MANAGER');

router.get('/admin/login', (req, res) => {
    res.render('admin/login', { "message": req.flash("error") });
});

router.post("/admin/login", passport.authenticate("local", {
    successRedirect: "/admin/users",
    failureRedirect: "/admin/login",
    failureFlash: true,
    passReqToCallback: true
}));

//BOSS User Manager CRUD

router.get('/admin/users',  checkBoss, checkManager,(req, res) => {
    User.find({}, (err, users) => {
        res.render('admin/users/list', {users:users,authUser: req.user});
    });
});

router.get('/admin/users/add', checkBoss, checkManager,  (req, res) => {
    console.log(req.user)
    res.render('admin/users/add', {authUser: req.user});
  
});

router.post('/admin/users/add',  checkBoss, checkManager, (req, res) => {
    const username = req.body.username;
    const password = req.body.password; 

    if (username === "" || password === "") {
        res.render("auth/signup", {
            message: "Username and Password Required"
        });
        return;
    }

    User.findOne({
            username
        })
        .then(user => {
            if (user !== null) {
                res.render("admin/users/add", {
                    message: "Username is not available"
                });
                return;
            }

            const salt = bcrypt.genSaltSync(10);
            const hashPass = bcrypt.hashSync(password, salt);

            const newUser = new User({
                username,
                password: hashPass
            });

            newUser.save((err) => {
                if (err) {
                    res.render("admin/users/add", {
                        message: "Error, contact sire admin."
                    });
                } else {
                    res.redirect("/admin/users");
                }
            });
        })
        .catch(error => {
            next(error)
        })
});

router.get('/admin/users/:id/edit',  checkBoss, (req, res) => {
    User.findOne({_id:req.params.id}, (err, userItem) => {
        res.render('admin/users/edit', {userItem:userItem,authUser: req.user});
    });
});

router.post('/admin/users/:id/edit',  checkBoss, (req, res) => {
    User.updateOne({
        _id: req.params.id
    }, req.body, (err, user) => {
        res.redirect("/admin/users");
    });
});

router.post('/admin/users/:id/delete',  checkBoss, checkManager, (req, res) => {
    User.deleteOne({
        _id: req.params.id
    }, (err, user) => {
        res.redirect("/admin/users");
    });
});

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/courses",
  failureRedirect: "/"
}));

router.get("/login", (req, res, next) => {
    res.render("login");
  });
  
router.post("/login", passport.authenticate("local", {
    successRedirect: "/courses",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});



module.exports = router;