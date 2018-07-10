const express = require('express');
const router  = express.Router();
const passport = require('passport');

router.post('/login',  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

router.get('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/')
})

module.exports = router;