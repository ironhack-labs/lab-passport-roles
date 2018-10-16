const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.redirect('/private');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/auth/login');
});


module.exports = router;