const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User.model')

/* GET home page */
router.get('/', (req, res) => {
    return res.render('index')
});

router.get('/login', (req, res) => {
    return res.render('login',{ errorMessage: req.flash('error') })
});
  
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/access-level',
        failureRedirect: '/login',
        failureFlash: true,
        passReqToCallback: true
      })
);

router.get('/access-level', async (req, res) => {
    const {user} = req
    const userLogged = await User.findOne({username:user.username})
    if(userLogged.accessLevel==='BOSS')
        return res.redirect('/admin/plataform-admin')
    if(userLogged.accessLevel!=='BOSS')
        return res.redirect('/employee/home')
    return res.render('login',{ errorMessage: req.flash('error') })
});


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})

module.exports = router;
