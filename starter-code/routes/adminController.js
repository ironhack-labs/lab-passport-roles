const express = require('express')
const passport = require('passport')
const ensureLogin = require('connect-ensure-login')

const adminController = express.Router();

const User = require('../models/user')

const bcrypt = require('bcrypt')
const bcryptSalt = 10;

adminController.get('/private', (req, res, next) => {
    next();
}, ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('private', { user: req.user})
})

adminController.get('/login', (req, res, next) => {
    res.render('auth/login', { message: req.flash('error')});
})

adminController.post('/login', passport.authenticate('local', {
    successRedirect: '/private',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}))

adminController.get('/addRemove', checkRoles('Boss'), (req, res) => {
    res.render('admin/addRemove', { user: req.user });
})

adminController.post('/addRemove', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const familyName = req.body.familyName;
    const role = req.body.role;

    if (username === "" || password === "" || name === "" || familyName === "" || role === "" ) {
        res.render('admin/addRemove', {message: "fill can't be empty"})
        return;
    }

    User.findOne({username}, "username", (err, user) => {
        if (user!== null) {
            res.render("admin/addRemove", { message: "The username already exist"})
            return
        }

        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt)

        const newUser = new User({
            username: username,
            password: hashPass,
            name: name,
            familyName: familyName,
            role: role
        })

        newUser.save((err) => {
            if (err) {
                res.render('admin/addRemove', {role: role, message: 'something went wrong !'})
            } else {
                res.redirect('/addRemove', {role: role,  message: 'Added !'})
            }
        })
    })
})

adminController.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("login");
  });
});

function checkRoles(role) {
    return function(req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        } else {
            res.redirect('/login')
        }
    }
}
module.exports = adminController;