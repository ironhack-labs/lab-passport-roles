const express = require('express');
const router  = express.Router();
const User = require('../models/User');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/login');
}

function checkRole(role) {
    return function(req, res, next) {
        if(req.isAuthenticated() && req.user.role === role)
            return next();
        res.redirect('/private');
    }
}

const checkBoss = checkRole('Boss');

router.get('/register', checkBoss, (req, res) => {
    res.render('register')
});

router.post('/register', (req, res) => {
    if(req.body.password !== req.body.confirmpassword)
        return res.render('login', {err: 'las contraseñas no son las mismas'});
    const {username, email, role, password} = req.body;
    User.register({username, email, role}, password)
        .then(user => {
            res.redirect('/users');
        })
});

router.get('/private', isLoggedIn, (req, res) => {
    let boss = false;
    if (req.user.role === 'Boss') {
        boss = true;
    }
    res.render('private', {user: req.user, boss});
});

router.get('/users', checkBoss, (req, res) => {
    User.find()
        .then(users => {
            res.render('users', {user: req.user, users})
        })
});

router.get('/user/delete/:id', checkBoss, (req,res) => {
    User
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.redirect('/users')
        })
    ;
});

module.exports = router;
